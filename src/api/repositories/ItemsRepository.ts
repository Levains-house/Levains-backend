import {Items} from "../models/Items";
import {db} from "../config/dbConfig";
import {ItemPurpose} from "../types/ItemPurpose";

export class ItemsRepository {

    private static instance: ItemsRepository;

    public static getInstance(){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new ItemsRepository();
    }

    private constructor(){}

    public async save(items: Items): Promise<void> {
        await db
            .insert(items)
            .into("Items")
            .catch((error) => {
                throw error;
            });
    }

    public async findByItemId(itemId: bigint): Promise<Array<Items>>{
        return await db
            .select("*")
            .from("Items as I")
            .where("I.item_id", String(itemId))
            .then((findItems) => {return findItems;})
            .catch((error) => {throw error;});
    }

    public async findSharedItemsByUserId(userId: bigint): Promise<Array<Items>> {
        return await db
            .select("*")
            .from("Items as I")
            .where("I.user_id", String(userId))
            .where("I.purpose", ItemPurpose.SHARE.toString())
            .then((findItems) => {return findItems;})
            .catch((error) => {throw error;});
    }

    public async updateTradeStatusByItemId(itemId: bigint, tradeStatus: string): Promise<void> {
        await db("Items as I")
            .update({
                trade_status: tradeStatus
            })
            .where("I.item_id", String(itemId))
            .catch((error) => {
                throw error;
            });
    }

}