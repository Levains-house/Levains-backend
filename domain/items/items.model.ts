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

    public async save(items: Array<Items>) {
        await knex.insert(items)
            .into("items");

        return items;
    }

}