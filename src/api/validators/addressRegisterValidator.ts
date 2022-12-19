import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {ERROR_MESSAGE} from "../utils/ErrorMessageProperties";
import {InvalidFieldTypeError, NotEnoughRequestDataError} from "../errors/CommonError";

export const AddressRegisterValidate = (request: Request, response: Response, next: NextFunction) => {

    try {
        const requestBody = request.body;
        if(requestBody.address === undefined
            || requestBody.address.length === 0){
            throw new NotEnoughRequestDataError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_1);
        }

        for (const address of requestBody.address) {
            if(address.latitude === undefined || address.longitude === undefined){
                throw new NotEnoughRequestDataError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_1);
            }

            if(typeof address.latitude !== "number" || typeof address.longitude !== "number"){
                throw new InvalidFieldTypeError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_2);
            }
        }

        return next();
    } catch(error: Error | any) {
        return response.status(error.code).json({message: error.message});
    }
}