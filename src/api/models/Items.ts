import {ItemTradeStatus} from "../types/ItemTradeStatus";
import {ItemCategory} from "../types/ItemCategory";
import {ItemPurpose} from "../types/ItemPurpose";

export class Items {

    public item_id: bigint | undefined;
    public user_id: bigint | undefined;
    public name: string | undefined;
    public description: string | undefined;
    public img_name?: string | undefined;
    public img_url?: string | undefined;
    public purpose: ItemPurpose | undefined;
    public category: ItemCategory | undefined;
    public trade_status: ItemTradeStatus | undefined;
}

export class ItemBuilder {

    private readonly item: Items;

    constructor() {
        this.item = new Items();
    }

    userId(userId: bigint){
        this.item.user_id = userId;
        return this;
    }

    name(name: string){
        this.item.name = name;
        return this;
    }

    description(description: string){
        this.item.description = description;
        return this;
    }

    imgName(imgName: string){
        this.item.img_name = imgName;
        return this;
    }

    imgUrl(imgUrl: string){
        this.item.img_url = imgUrl;
        return this;
    }

    purpose(purpose: ItemPurpose){
        this.item.purpose = purpose;
        return this;
    }

    category(category: ItemCategory){
        this.item.category = category;
        return this;
    }

    tradeStatus(tradeStatus: ItemTradeStatus){
        this.item.trade_status = tradeStatus;
        return this;
    }

    build() {
        return this.item;
    }
}