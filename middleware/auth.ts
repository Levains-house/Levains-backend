import {InvalidTokenError, TokenNotFoundError} from "../common/authorization.error";
import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";

export const auth = (request: Request, response: Response, next: NextFunction) => {
    try {
        const accessToken = request.headers.authorization;
        if(accessToken === undefined){
            throw new TokenNotFoundError(401, "인가받지 않은 사용자 입니다");
        } else if(accessToken.substring(0, 7) !== String(process.env.JWT_PREFIX)){
            throw new InvalidTokenError(401, "유효하지 않은 토큰입니다");
        }

        const decodedToken =
            jwt.verify(accessToken.substring(7), String(process.env.JWT_SECRET_KEY));
        response.locals.token = decodedToken;

        return next();
    } catch(error: any | Error) {
        return response.status(error.code).json({message: error.message});
    }
}