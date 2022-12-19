import {UserBuilder} from "../../models/Users";
import {Address, AddressBuilder} from "../../models/Address";

export class SignInRequest {

    private readonly _username: string;
    private readonly _kakao_talk_chatting_url: string;
    private readonly _role: string;

    constructor(username: string, kakao_talk_chatting_url: string, role: string) {
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

    get role(): string {
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

export class AddressCreateRequest {

    private readonly _user_id: bigint;
    private readonly _address: Array<AddressRequest>

    constructor(user_id: bigint, address: Array<AddressRequest>) {
        this._user_id = user_id;
        this._address = address;
    }

    get user_id(): bigint {
        return this._user_id;
    }

    get address(): Array<AddressRequest> {
        return this._address;
    }

    public toAddresses(): Array<Address>{
        const addresses = Array<Address>();
        for(let i = 0; i < this.address.length; i++){
            addresses.push(
                new AddressBuilder()
                    .userId(this.user_id)
                    .latitude(this.address[i].latitude)
                    .longitude(this.address[i].longitude)
                    .build()
            )
        }

        return addresses;
    }
}

type AddressRequest = {
    latitude: bigint;
    longitude: bigint;
}


export class SignInResponse {

    constructor(public access_token: string) {
    }

}