import {ItemTradeStatus} from "../../types/ItemTradeStatus";

export class MyItemsListResponse {

    constructor(
        public item_id: bigint,
        public name: string,
        public trade_status: ItemTradeStatus
    ) {}

}