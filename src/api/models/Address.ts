
export class Address {

    public address_id: bigint | undefined;
    public user_id: bigint | undefined;
    public latitude: bigint | undefined;
    public longitude: bigint | undefined;
}

export class AddressBuilder {

    private readonly address: Address;

    constructor() {
        this.address = new Address();
    }

    userId(userId: bigint){
        this.address.user_id = userId;
        return this;
    }

    latitude(latitude: bigint){
        this.address.latitude = latitude;
        return this;
    }

    longitude(longitude: bigint){
        this.address.longitude = longitude;
        return this;
    }

    build() {
        return this.address;
    }
}