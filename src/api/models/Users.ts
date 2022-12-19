export class Users {

    public user_id: bigint | undefined;
    public username: string | undefined;
    public kakao_talk_chatting_url: string | undefined;
    public role: string | undefined;
}

export class UserBuilder {

    private readonly user: Users;

    constructor() {
        this.user = new Users();
    }

    username(username: string){
        this.user.username = username;
        return this;
    }

    kakaoTalkChattingUrl(kakaoTalkChattingUrl: string){
        this.user.kakao_talk_chatting_url = kakaoTalkChattingUrl;
        return this;
    }

    role(role: string){
        this.user.role = role;
        return this;
    }

    build() {
        return this.user;
    }
}