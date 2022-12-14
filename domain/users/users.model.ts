import {knex} from "../../config/db.config";
import {Users} from "./users";
import {Address} from "./address";

export class UsersModel {

    private static instance: UsersModel;

    public static getInstance(){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new UsersModel();
    }

    private constructor(){}

    public async save(user: Users) {
        await knex.insert(user)
            .into("Users");

        return user;
    }

    public async findByUsername(username: string): Promise<Users>{
        const user = await knex.select('*')
            .from('Users AS U')
            .where('U.username', username);

        return user[0];
    }

    public async existsByUsername(username: string) {
        const users: Array<Users> = await knex.select("*")
            .from("Users as U")
            .where("U.username", username);
        //유저 존재유무 반환
        if(users.length == 0) return false;
        else return true;
    }

    public async saveAddress(address: Array<Address>) {
        await knex.insert(address)
            .into("Address");
    }
}