import {db} from "../config/dbConfig";
import {Users} from "../models/Users";
import {Address} from "../models/Address";
import {UserRole} from "../types/UserRole";

export class UsersRepository {

    private static instance: UsersRepository;

    public static getInstance(){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new UsersRepository();
    }

    private constructor(){}

    public async save(user: Users): Promise<void> {
        await db
            .insert(user)
            .into("Users")
            .catch((error) => {
                throw error;
            });
    }

    public async findByUsername(username: string): Promise<Array<Users>>{
        return await db
            .select('*')
            .from('Users AS U')
            .where('U.username', username)
            .then((findUsers) => { return findUsers; })
            .catch((error) => { throw error; });
    }

    public async findUserAndAddressByUserId(userId: bigint): Promise<any[]>{
        return await db
            .select('*')
            .from('Users AS U')
            .innerJoin('Address as A', 'U.user_id', '=', 'A.user_id')
            .where('U.user_id', String(userId))
            .then((findUsers) => {
                return findUsers;
            })
            .catch((error) => {
                throw error;
            })
    }

    public async findUserAndAddressByUserIdAndOppositeRole(userId: bigint, role: string){
        let difRole = UserRole.LOCAL.toString();
        if(role === UserRole.LOCAL.toString()){
            difRole = UserRole.TRAVEL.toString();
        }
        return await db
            .select("*")
            .from("Users as U")
            .innerJoin('Address as A', 'U.user_id', '=', 'A.user_id')
            .where("U.role", difRole)
            .then((findUsers) => {
                return findUsers;
            })
            .catch((error) => {
                throw error;
            });
    }

    public async findSharedItemsByUserIds(userId: bigint, otherUserIds: any[]){

        const whereSubquery = await db.select("ISW.category")
            .from("Items as ISW")
            .where("ISW.user_id", String(userId))
            .where("ISW.purpose", "WANT");
        const wantCategory = Array();
        whereSubquery.map(s => wantCategory.push(s.category));

        const selectSubquery = await db
            .select("ISS.name", "ISS.description", "ISS.category")
            .from("Items as ISS")
            .whereIn("ISS.user_id", otherUserIds)
            .where("ISS.purpose", "WANT");
        const random = Math.floor(Math.random() * selectSubquery.length);
        const wantItems = selectSubquery[random];

        const sharedItems = await db
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

        const items = await db
            .select("I.item_id", "I.img_url", "I.name", "I.description", "I.category", "U.kakao_talk_chatting_url")
            .from("Users as U")
            .innerJoin('Items as I', 'U.user_id', '=', 'I.user_id')
            .where("I.purpose", "SHARE")
            .where("I.category", category)
            .whereIn("U.user_id", otherUserIds);

        return items;
    }
}