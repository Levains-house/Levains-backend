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

    public async findSharedItemsByUserIds(userId: bigint, otherUserIds: any[]){

        const whereSubquery = await knex.select("ISW.category")
            .from("Items as ISW")
            .where("ISW.user_id", String(userId))
            .where("ISW.purpose", "WANT");
        const wantCategory = Array();
        whereSubquery.map(s => wantCategory.push(s.category));

        const selectSubquery = await knex
            .select("ISS.name", "ISS.description", "ISS.category")
            .from("Items as ISS")
            .whereIn("ISS.user_id", otherUserIds)
            .where("ISS.purpose", "WANT");
        const random = Math.floor(Math.random() * selectSubquery.length);
        const wantItems = selectSubquery[random];

        const sharedItems = await knex
            .select("I.item_id", "I.img_url", "I.name", "I.description",
                "I.category", "U.kakao_talk_chatting_url")
            .from("Users as U")
            .innerJoin('Items as I', 'U.user_id', '=', 'I.user_id')
            .where("I.purpose", "SHARE")
            .whereIn("I.category", wantCategory)
            .whereIn("U.user_id", otherUserIds);

        return [sharedItems, wantItems];
    }

    public async findWantItemsByUserIdsAndCategory(otherUserIds: any[], category: string){

        const items = await knex
            .select("I.item_id", "I.img_url", "I.name", "I.description", "I.category", "U.kakao_talk_chatting_url")
            .from("Users as U")
            .innerJoin('Items as I', 'U.user_id', '=', 'I.user_id')
            .where("I.purpose", "SHARE")
            .where("I.category", category)
            .whereIn("U.user_id", otherUserIds);

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