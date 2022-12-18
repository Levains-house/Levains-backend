import {Items} from "./items";
import {knex} from "../../config/db.config";

export class ItemsModel {

    private static instance: ItemsModel;

    public static getInstance(){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new ItemsModel();
    }

    private constructor(){}

    public async save(items: Items) {
        await knex.insert(items)
            .into("Items")
            .catch((error) => {
                throw error;
            });

        return items;
    }

    public async updateTradeStatusByItemId(itemId: bigint, tradeStatus: string) {
        await knex("Items as I")
            .update({
                trade_status: tradeStatus
            })
            .where("I.item_id", String(itemId))
            .catch((error) => {
                throw error;
            });
    }

}