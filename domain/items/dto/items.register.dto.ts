import {ItemBuilder} from "../items";

export class ItemRegisterRequest {

    private readonly _user_id: bigint;
    private readonly _item_type: string;
    private readonly _category: string;
    private readonly _name: string;
    private readonly _img_name: string;
    private readonly _img_url: string;

    constructor(user_id: bigint, item_type: string, category: string, name: string, img_name: string, img_url: string) {
        this._user_id = user_id;
        this._item_type = item_type;
        this._category = category;
        this._name = name;
        this._img_name = img_name;
        this._img_url = img_url;
    }

    get user_id(): bigint {
        return this._user_id;
    }

    get category(): string {
        return this._category;
    }

    get name(): string {
        return this._name;
    }

    get img_name(): string {
        return this._img_name;
    }

    get img_url(): string {
        return this._img_url;
    }

    get item_type(): string {
        return this._item_type;
    }

    public toItem(){
        return new ItemBuilder()
            .userId(this.user_id)
            .itemType(this.item_type)
            .category(this.category)
            .tradeStatus("BEFORE")
            .name(this.name)
            .imgName(this.img_name)
            .imgUrl(this.img_url)
            .build();
    }
}