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
import SendData = ManagedUpload.SendData;

export class ItemsService {

    private itemsRepository: ItemsRepository;

    private static instance: ItemsService;

    public static getInstance(itemsRepository: ItemsRepository){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new ItemsService(itemsRepository);
    }

    private constructor(itemsRepository: ItemsRepository){
        this.itemsRepository = itemsRepository;
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
        await fs.unlinkSync(fileData.path);

        return {
            img_name: fileName,
            img_url: result.Location
        };
    }
}