import {ItemsRepository} from "../repositories/ItemsRepository";
import path from "path";
import fs from "fs";
import S3 from "../config/S3Config";
import {AWSS3Error} from "../errors/S3Error";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import {ItemRegisterRequest} from "../controllers/requests/ItemsRegisterRequest";
import {StatusCodes} from "http-status-codes";
import {ERROR_MESSAGE} from "../utils/ErrorMessageProperties";
import {ItemsNotFoundError} from "../errors/ItemsError";
import {UserRole} from "../types/UserRole";
import {UsersRepository} from "../repositories/UsersRepository";
import {ItemCategory} from "../types/ItemCategory";
import SendData = ManagedUpload.SendData;

export class ItemsService {

    private itemsRepository: ItemsRepository;
    private usersRepository: UsersRepository;

    private static instance: ItemsService;

    public static getInstance(itemsRepository: ItemsRepository, usersRepository: UsersRepository){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new ItemsService(itemsRepository, usersRepository);
    }

    private constructor(itemsRepository: ItemsRepository, usersRepository: UsersRepository){
        this.itemsRepository = itemsRepository;
        this.usersRepository = usersRepository;
    }

    public async getMyItemsList(userId: bigint) {
        return await this.itemsRepository
            .findSharedItemsByUserId(userId);
    }

    public async register(itemRegisterRequest: ItemRegisterRequest) {
        await this.itemsRepository
            .save(itemRegisterRequest.toItem());
    }

    public async updateTradeStatus(itemId: bigint, tradeStatus: string){
        const findItems = await this.itemsRepository.findByItemId(itemId);
        if(findItems.length === 0){
            throw new ItemsNotFoundError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_2);
        }
        await this.itemsRepository
            .updateTradeStatusByItemId(itemId, tradeStatus);
    }

    public async uploadImageToS3(fileData: Express.Multer.File): Promise<any> {
        //로컬에 저장한 이미지 파일 읽어오기
        const fileStream = await fs.readFileSync(fileData.path);

        const fileName = `${fileData.filename}${path.extname(fileData.originalname)}`;
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: fileName,
            Body: fileStream
        };

        const result = await S3.upload(uploadParams, (error: Error, data: SendData) => {
            if (error) {
                console.error(`S3 ERROR=${error}`);
                throw new AWSS3Error(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        }).promise();

        //S3에 파일을 저장했으면 로컬 파일 제거
        await this.deleteFileFromLocalStorage(fileData.path);

        return {
            img_name: fileName,
            img_url: result.Location
        };
    }

    private async deleteFileFromLocalStorage(path: string): Promise<void> {
        await fs.unlinkSync(path);
    }

    public async getRecommendItemsList(userId: bigint, role: UserRole, range: number){
        const users = await this.usersRepository.findUserAndAddressByUserId(userId);
        let oppositeRole = UserRole.LOCAL;
        if(role === UserRole.LOCAL){
            oppositeRole = UserRole.TRAVEL;
        }

        const oppositeUsers = await this.usersRepository.findUserAndAddressByRole(oppositeRole);

        //다른 역할의 사용자들과 거리 비교해서 거리 안에 들어오는 유저를 가져온다.
        const oppositeUserIds = await this.getValidUserBetweenTwoUsersByRange(users[0], oppositeUsers, range);
        //내가 원하는 물건들을 가져온다.
        const wantedItems = await this.itemsRepository.findWantedItemsByUserId(userId);
        const wantedCategories = Array<ItemCategory>();
        wantedItems.map(i => wantedCategories.push(i.category as ItemCategory));

        const recommendItems = await this.itemsRepository.findSharedItemsByUserIdsAndCategories(oppositeUserIds, wantedCategories);
        const oppositeWantedItems = await this.itemsRepository.findWantedItemsByUserIds(oppositeUserIds);

        return {
            recommend_items: recommendItems,
            opposite_wanted_items: oppositeWantedItems
        }
    }

    public async getRecommendExperienceItemsList(userId: bigint, role: UserRole, range: number){
        const users = await this.usersRepository.findUserAndAddressByUserId(userId);
        let oppositeRole = UserRole.LOCAL;
        if(role === UserRole.LOCAL){
            oppositeRole = UserRole.TRAVEL;
        }

        const otherUsers = await this.usersRepository.findUserAndAddressByRole(oppositeRole);

        //다른 역할의 사용자들과 거리 비교해서 거리 안에 들어오는 유저를 가져온다.
        const otherUserIds = await this.getValidUserBetweenTwoUsersByRange(users[0], otherUsers, range);
        //거리 안의 들어오는 유저들중에 체험 나눔들을 가져온다.
        return await this.itemsRepository
            .findSharedItemsByUserIdsAndCategory(otherUserIds, ItemCategory.EXPERIENCE);
    }

    private async getValidUserBetweenTwoUsersByRange(users: any, otherUsers: any[], range: number){
        let userIds = Array();
        for(let j = 0; j < otherUsers.length; j++){
            const distance = await this.getDistance(
                users.latitude,
                users.longitude,
                otherUsers[j].latitude,
                otherUsers[j].longitude
            );

            if(distance <= range){
                userIds.push(otherUsers[j].user_id);
            }
        }
        userIds.filter((element, index) => {
            return userIds.indexOf(element) === index;
        });

        return userIds;
    }

    private async getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        if ((lat1 == lat2) && (lon1 == lon2))
            return 0;

        var radLat1 = Math.PI * lat1 / 180;
        var radLat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radTheta = Math.PI * theta / 180;
        var dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
        if (dist > 1)
            dist = 1;

        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515 * 1.609344 * 1000;
        if (dist < 100) dist = Math.round(dist / 10) * 10;
        else dist = Math.round(dist / 100) * 100;

        return dist / 1000;
    }
}