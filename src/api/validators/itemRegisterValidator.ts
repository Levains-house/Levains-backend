import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {ERROR_MESSAGE} from "../utils/ErrorMessageProperties";
import {ItemCategory} from "../types/ItemCategory";
import {ItemPurpose} from "../types/ItemPurpose";
import {InvalidFieldTypeError, NotEnoughRequestDataError} from "../errors/CommonError";

export const itemRegisterValidator = (request: Request, response: Response, next: NextFunction) => {

    try {
        const requestBody = request.body;
        if (requestBody.name === undefined
            || requestBody.description === undefined
            || requestBody.category === undefined
            || requestBody.purpose === undefined) {
            throw new NotEnoughRequestDataError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_1);
        }

        if(!(requestBody.category in ItemCategory) || !(requestBody.purpose in ItemPurpose)){
            throw new InvalidFieldTypeError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_2);
        }

        return next();
    } catch(error: Error | any) {
        return response.status(error.code).json({message: error.message});
    }
}