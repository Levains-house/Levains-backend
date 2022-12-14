import jwt from "jsonwebtoken";
import {UsersModel} from "./users.model";
import {SignInRequest} from "./dto/users.signin.dto";
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

    public async issueJwtToken(user: Users): Promise<string> {

        const accessToken = jwt.sign({
            type: 'JWT',
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

        const accessToken = jwt.sign({
            type: 'JWT',
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