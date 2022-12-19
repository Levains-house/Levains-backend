import {db} from "../config/dbConfig";
import {Address} from "../models/Address";

export class AddressRepository {

    private static instance: AddressRepository;

    public static getInstance(){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new AddressRepository();
    }

    private constructor(){}

    public async save(addresses: Array<Address>): Promise<void> {
        await db
            .insert(addresses)
            .into("Address")
            .catch((error) => {
                throw error;
            });
    }

}