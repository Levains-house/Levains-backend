import {NextFunction, Request, Response} from "express";
import {NotEnoughRequestDataError} from "../errors/UsersError";
import {StatusCodes} from "http-status-codes";
import {UserRole} from "../types/UserRole";
import {ERROR_MESSAGE} from "../utils/ErrorMessageProperties";

const kakaoTalkChattingUrlCheck = "https://open.kakao.com/";

export const signInValidate = (request: Request, response: Response, next: NextFunction) => {

    try {
        const requestBody = request.body;
        if(requestBody.username === undefined
            || requestBody.kakao_talk_chatting_url === undefined
            || requestBody.role === undefined) {
            throw new NotEnoughRequestDataError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_1);
        }

        if(!requestBody.kakao_talk_chatting_url.startsWith(kakaoTalkChattingUrlCheck)
            || !(requestBody.role in UserRole)){
            throw new NotEnoughRequestDataError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_2);
        }

        return next();
    } catch(error: Error | any) {
        return response.status(error.code).json({message: error.message});
    }
}