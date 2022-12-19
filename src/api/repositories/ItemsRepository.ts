import {Items} from "../models/Items";
import {db} from "../config/dbConfig";

export class ItemsRepository {

    private static instance: ItemsRepository;

    public static getInstance(){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new ItemsRepository();
    }

    private constructor(){}

    public async save(items: Items) {
        await db.insert(items)
            .into("Items")
            .catch((error) => {
                throw error;
            });

        return items;
    }

    public async updateTradeStatusByItemId(itemId: bigint, tradeStatus: string) {
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