import express, {NextFunction, Request, Response} from "express";
import {NotEnoughRequestDataError} from "../errors/UsersError";
import {StatusCodes} from "http-status-codes";

export const signInValidate = (request: Request, response: Response, next: NextFunction) => {

    try {
        const requestBody = request.body;
        if(requestBody.username === undefined
            || requestBody.kakao_talk_chatting_url === undefined
            || requestBody.role === undefined){
            throw new NotEnoughRequestDataError(StatusCodes.BAD_REQUEST, "요청 파라미터가 부족합니다");
        }

        return next();
    } catch(error: Error | any) {
        return response.status(error.code).json({message: error.message});
    }
}