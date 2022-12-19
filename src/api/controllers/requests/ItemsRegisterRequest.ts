import {ItemBuilder} from "../../models/Items";
import {ItemPurpose} from "../../types/ItemPurpose";
import {ItemCategory} from "../../types/ItemCategory";
import {ItemTradeStatus} from "../../types/ItemTradeStatus";

export class ItemRegisterRequest {

    private readonly _user_id: bigint;
    private readonly _purpose: ItemPurpose;
    private readonly _category: ItemCategory;
    private readonly _name: string;
    private readonly _description: string;
    private _img_name?: string;
    private _img_url?: string;

    constructor(user_id: bigint, purpose: ItemPurpose, category: ItemCategory, name: string, description: string, img_name?: string, img_url?: string) {
        this._user_id = user_id;
        this._purpose = purpose;
        this._category = category;
        this._name = name;
        this._description = description;
        this._img_name = img_name;
        this._img_url = img_url;
    }

    get user_id(): bigint {
        return this._user_id;
    }

    get category(): ItemCategory {
        return this._category;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get img_name(): string {
        return <string>this._img_name;
    }

    get img_url(): string {
        return <string>this._img_url;
    }

    get purpose(): ItemPurpose {
        return this._purpose;
    }

    set img_name(value: string) {
        this._img_name = value;
    }

    set img_url(value: string) {
        this._img_url = value;
    }

    public toItem(){
        return new ItemBuilder()
            .userId(this.user_id)
            .purpose(this.purpose)
            .category(this.category)
            .tradeStatus(ItemTradeStatus.BEFORE)
            .name(this.name)
            .description(this.description)
            .imgName(this.img_name)
            .imgUrl(this.img_url)
            .build();
    }
}