import {Address, AddressBuilder} from "../../models/Address";

export class AddressRegisterRequest {

    private readonly _user_id: bigint;
    private readonly _addresses: Array<AddressType>

    constructor(user_id: bigint, address: Array<AddressType>) {
        this._user_id = user_id;
        this._addresses = address;
    }

    get user_id(): bigint {
        return this._user_id;
    }

    get addresses(): Array<AddressType> {
        return this._addresses;
    }

    public toAddresses(): Array<Address>{
        return this.addresses.map(a => new AddressBuilder()
            .userId(this.user_id)
            .latitude(a.latitude)
            .longitude(a.longitude)
            .build());
    }
}

type AddressType = {
    latitude: bigint;
    longitude: bigint;
}