import jwt from "jsonwebtoken";
import {UsersModel} from "./users.model";
import {AddressCreateRequest, SignInRequest} from "./dto/users.signin.dto";
import {Users} from "./users";

export class UsersService {

    private userModel: UsersModel;

    private static instance: UsersService;

    public static getInstance(userModel: UsersModel){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new UsersService(userModel);
    }

    private constructor(userModel: UsersModel){
        this.userModel = userModel;
    }

    public async signIn(signInRequest: SignInRequest): Promise<string> {
        //아이디 검증
        const user: Users =
            await this.userModel.save(signInRequest.toUser());

        return this.issueJwtToken(user);
    }

    public async isNewUser(signInRequest: SignInRequest) {
        const username = signInRequest.username;
        return !await this.userModel.existsByUsername(username);
    }

    public async createAddress(addressCreateRequest: AddressCreateRequest){
        await this.userModel.saveAddress(addressCreateRequest.toAddresses());
    }

    public async getDifferentUsersByRange(userId: bigint, role: string, range: number) {
        const user = await this.userModel
            .findUserAndAddressByUserId(userId);
        const difUsers = await this.userModel
            .findDifferentSideUserByUserId(userId, role);

        const userIdArr = await this.distinctRangeUser(user, difUsers, range);

        return await this.userModel
            .findUserAndItemsByUserIdsAndItemType(userIdArr, "OPPONENT");
    }

    public async getExperienceDifferentUsersByRange(userId: bigint, role: string, range: number) {
        const user = await this.userModel
            .findUserAndAddressByUserId(userId);
        const difUsers = await this.userModel
            .findDifferentSideUserByUserId(userId, role);

        const userIdArr = await this.distinctRangeUser(user, difUsers, range);

        return await this.userModel
            .findUserAndItemsByUserIdsAndItemTypeAndCategoryExperience(userIdArr, "OPPONENT");
    }

    private async distinctRangeUser(user: any[], difUsers: any[], range: number){
        const userIdArr = Array();
        for(let i = 0; i < user.length; i++){
            for(let j = 0; j < difUsers.length; j++){
                const distance = await this.getDistance(
                    user[i].latitude,
                    user[i].longitude,
                    difUsers[j].latitude,
                    difUsers[j].longitude
                );
                if(distance <= range){
                    userIdArr.push(difUsers[j].user_id);
                }
            }
        }

        return userIdArr;
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

        return dist;
    }

    public async issueJwtToken(user: Users): Promise<string> {

        const findUser = await this.userModel.findByUsername(user.username as string);

        const accessToken = jwt.sign({
            type: 'JWT',
            user_id: findUser.user_id,
            username: user.username,
            kakao_talk_chatting_url: user.kakao_talk_chatting_url,
            role: user.role
        }, String(process.env.JWT_SECRET_KEY), {
            expiresIn: process.env.JWT_EXPIRED_TIME,
            issuer: process.env.JWT_ISSUER
        });

        return process.env.JWT_PREFIX + accessToken;
    }


    public async reIssueJwtToken(signInRequest: SignInRequest): Promise<string> {
        const findUser = await this.userModel.findByUsername(signInRequest.username);

        const accessToken = jwt.sign({
            type: 'JWT',
            user_id: findUser.user_id,
            username: signInRequest.username,
            kakao_talk_chatting_url: signInRequest.kakao_talk_chatting_url,
            role: signInRequest.role
        }, String(process.env.JWT_SECRET_KEY), {
            expiresIn: process.env.JWT_EXPIRED_TIME,
            issuer: process.env.JWT_ISSUER
        });

        return process.env.JWT_PREFIX + accessToken;
    }
}