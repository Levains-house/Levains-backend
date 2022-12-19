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

    //TODO: 액세스 토큰 발급
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

}