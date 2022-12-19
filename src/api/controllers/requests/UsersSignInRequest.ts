import {UserBuilder} from "../../models/Users";
import {UserRole} from "../../types/UserRole";

export class UsersSignInRequest {

    private readonly _username: string;
    private readonly _kakao_talk_chatting_url: string;
    private readonly _role: UserRole;

    constructor(username: string, kakao_talk_chatting_url: string, role: UserRole) {
        this._username = username;
        this._kakao_talk_chatting_url = kakao_talk_chatting_url;
        this._role = role;
    }

    get username(): string {
        return this._username;
    }

    get kakao_talk_chatting_url(): string {
        return this._kakao_talk_chatting_url;
    }

    get role(): UserRole {
        return this._role;
    }

    public toUser(){
        return new UserBuilder()
            .username(this.username)
            .kakaoTalkChattingUrl(this.kakao_talk_chatting_url)
            .role(this.role)
            .build();
    }
}