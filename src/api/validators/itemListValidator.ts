import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {ERROR_MESSAGE} from "../utils/ErrorMessageProperties";
import {InvalidFieldTypeError, NotEnoughRequestDataError} from "../errors/CommonError";

export const itemListValidator = (request: Request, response: Response, next: NextFunction) => {

    try {
        const range = request.query.range;
        if (request.query.range === undefined) {
            throw new NotEnoughRequestDataError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_1);
        }

        if(typeof Number(range) !== "number"){
            throw new InvalidFieldTypeError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_2);
        }

        return next();
    } catch(error: Error | any) {
        return response.status(error.code).json({message: error.message});
    }
}