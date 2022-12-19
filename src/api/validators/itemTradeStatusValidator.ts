import {NextFunction, Request, Response} from "express";
import {NotEnoughRequestDataError} from "../errors/UsersError";
import {StatusCodes} from "http-status-codes";
import {ERROR_MESSAGE} from "../utils/ErrorMessageProperties";
import {ItemTradeStatus} from "../types/ItemTradeStatus";

export const itemTradeStatusValidator = (request: Request, response: Response, next: NextFunction) => {

    try {
        const requestBody = request.body;
        if (requestBody.item_id === undefined
            || requestBody.trade_status === undefined) {
            throw new NotEnoughRequestDataError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_1);
        }

        if(typeof BigInt(requestBody.item_id) !== "bigint"
            || !(requestBody.trade_status in ItemTradeStatus)){
            throw new NotEnoughRequestDataError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_2);
        }

        return next();
    } catch(error: Error | any) {
        return response.status(error.code).json({message: error.message});
    }
}