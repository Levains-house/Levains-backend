import {Items} from "../models/Items";
import {db} from "../config/dbConfig";
import {ItemPurpose} from "../types/ItemPurpose";
import {ItemCategory} from "../types/ItemCategory";

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

    public async findSharedItemsByUserIdsAndCategory(userIds: Array<string>, category: ItemCategory): Promise<Array<Items>> {
        return await db
            .select("*")
            .from("Items as I")
            .whereIn("I.user_id", userIds)
            .where("I.category", category.toString())
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

    public async findWantedItemsByUserId(userId: bigint): Promise<Array<Items>> {
        return await db
            .select("*")
            .from("Items as I")
            .where("I.user_id", String(userId))
            .where("I.purpose", ItemPurpose.WANT.toString())
            .then((findItems) => {return findItems;})
            .catch((error) => {throw error;});
    }

    public async findWantedItemsByUserIds(userIds: Array<string>): Promise<Array<Items>> {
        return await db
            .select("*")
            .from("Items as I")
            .whereIn("I.user_id", userIds)
            .where("I.purpose", ItemPurpose.WANT.toString())
            .then((findItems) => {return findItems;})
            .catch((error) => {throw error;});
    }

    public async findSharedItemsByUserIdsAndCategories(userIds: Array<string>, categories: Array<ItemCategory>): Promise<Array<Items>> {
        return await db
            .select("*")
            .from("Items as I")
            .where("I.purpose", ItemPurpose.SHARE.toString())
            .whereIn("I.category", categories)
            .whereIn("I.user_id", userIds)
            .then((findItems) => {return findItems})
            .catch((error) => {throw error;});
    }

}