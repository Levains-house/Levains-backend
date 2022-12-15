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

    public async findUserAndAddressByUserId(userId: bigint){
        const users = await knex.select('*')
            .from('Users AS U')
            .innerJoin('Address as A', 'U.user_id', '=', 'A.user_id')
            .where('U.user_id', String(userId));

        return users;
    }

    public async findUserAndAddressByUserIdAndOppositeRole(userId: bigint, role: string){

        let difRole = "LOCAL";
        if(role === "LOCAL"){
            difRole = "TRAVEL";
        }
        const users = await knex
            .select("*")
            .from("Users as U")
            .innerJoin('Address as A', 'U.user_id', '=', 'A.user_id')
            .where("U.role", difRole);

        return users;
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

    public async findSharedItemsByUserIds(userIds: any[]){

        const items = await knex
            .select("I.item_id", "I.img_url", "I.name", "I.description", "I.category", "U.kakao_talk_chatting_url")
            .from("Users as U")
            .innerJoin('Items as I', 'U.user_id', '=', 'I.user_id')
            .where("I.purpose", "SHARE")
            .whereIn("U.user_id", userIds);

        return items;
    }

    public async findWantItemsByUserIdsAndCategory(userIds: any[], category: string){

        const items = await knex
            .select("I.item_id", "I.img_url", "I.name", "I.description", "I.category", "U.kakao_talk_chatting_url")
            .from("Users as U")
            .innerJoin('Items as I', 'U.user_id', '=', 'I.user_id')
            .where("I.purpose", "WANT")
            .where("I.category", category)
            .whereIn("U.user_id", userIds);

        return items;
    }

    public async findSharedItemsByUserId(userId: bigint) {
        const items = await knex
            .select("I.item_id", "I.name", "I.trade_status")
            .from("Users as U")
            .innerJoin("Items as I", "U.user_id", "=", "I.user_id")
            .where("U.user_id", String(userId))
            .where("I.purpose", "SHARE");

        return items;
    }
}