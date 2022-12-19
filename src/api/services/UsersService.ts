import jwt from "jsonwebtoken";
import {UsersRepository} from "../repositories/UsersRepository";
import {Users} from "../models/Users";
import {UsersSignInRequest} from "../controllers/requests/UsersSignInRequest";

export class UsersService {

    private usersRepository: UsersRepository;

    private static instance: UsersService;

    public static getInstance(usersRepository: UsersRepository){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new UsersService(usersRepository);
    }

    private constructor(usersRepository: UsersRepository){
        this.usersRepository = usersRepository;
    }
    //TODO: 로그인
    public async signIn(usersSignInRequest: UsersSignInRequest): Promise<Array<Users>> {
        const user = usersSignInRequest.toUser();
        await this.usersRepository.save(user);
        //저장된 유저 반환
        return await this.usersRepository.findByUsername(user.username as string);
    }

    public async getUsersByUsername(username: string): Promise<Array<Users>> {
        return await this.usersRepository.findByUsername(username);
    }

    public async issueJwtToken(user: Users): Promise<string> {

        const accessToken = jwt.sign({
            type: 'JWT',
            user_id: user.user_id,
            username: user.username,
            kakao_talk_chatting_url: user.kakao_talk_chatting_url,
            role: user.role
        }, String(process.env.JWT_SECRET_KEY), {
            expiresIn: process.env.JWT_EXPIRED_TIME,
            issuer: process.env.JWT_ISSUER
        });

        return process.env.JWT_PREFIX + accessToken;
    }

    public async getWantedCategoryItems(userId: bigint, role: string, range: number) {
        // 현재 사용자, 주소 정보들을 불러온다.
        const users = await this.usersRepository
            .findUserAndAddressByUserId(userId);
        // 현재 사용자와 다른 유형의 사용자, 주소 정보들을 불러온다.
        const otherUsers = await this.usersRepository
            .findUserAndAddressByUserIdAndOppositeRole(userId, role);
        // 다른 유형의 사용자 중에 거리 범위내에 있는 사용자를 조회한다.
        const userIds = await this.getValidUserBetweenTwoUsersByRange(users, otherUsers, range);

        // 조회한 다른 유형의 사용자의 PK로 상품 조회
        return await this.usersRepository
            .findSharedItemsByUserIds(userId, userIds);
    }

    public async getWantedCategoryItemsByExperience(userId: bigint, role: string, range: number) {
        const user = await this.usersRepository
            .findUserAndAddressByUserId(userId);
        const difUsers = await this.usersRepository
            .findUserAndAddressByUserIdAndOppositeRole(userId, role);

        const userIds = await this.getValidUserBetweenTwoUsersByRange(user, difUsers, range);

        return await this.usersRepository
            .findWantItemsByUserIdsAndCategory(userIds, "EXPERIENCE");
    }

    private async getValidUserBetweenTwoUsersByRange(users: any[], otherUsers: any[], range: number){
        let userIds = Array();
        for(let i = 0; i < users.length; i++){
            for(let j = 0; j < otherUsers.length; j++){
                const distance = await this.getDistance(
                    users[i].latitude,
                    users[i].longitude,
                    otherUsers[j].latitude,
                    otherUsers[j].longitude
                );

                if(distance <= range){
                    userIds.push(otherUsers[j].user_id);
                }
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