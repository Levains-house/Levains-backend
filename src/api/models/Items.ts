
export class Items {

    public item_id: bigint | undefined;
    public user_id: bigint | undefined;
    public name: string | undefined;
    public description: string | undefined;
    public img_name: string | undefined;
    public img_url: string | undefined;
    public purpose: string | undefined;
    public category: string | undefined;
    public trade_status: string | undefined;
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

    itemType(itemType: string){
        this.item.purpose = itemType;
        return this;
    }

    category(category: string){
        this.item.category = category;
        return this;
    }

    tradeStatus(tradeStatus: string){
        this.item.trade_status = tradeStatus;
        return this;
    }

    build() {
        return this.item;
    }
}