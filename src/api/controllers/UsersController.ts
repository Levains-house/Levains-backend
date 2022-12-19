import express, {NextFunction, Request, Response} from "express";
import {appConfig} from "../config/appConfig";
import {StatusCodes} from "http-status-codes";
import {signInValidate} from "../validators/userSignInValidator";
import {UsersSignInResponse} from "./responses/UsersSignInResponse";
import {UsersSignInRequest} from "./requests/UsersSignInRequest";
import {ERROR_MESSAGE} from "../utils/ErrorMessageProperties";

const router = express.Router();
const userService = appConfig.UsersService;

//TODO: [POST] /api/users/sign-in
router.post("/sign-in", signInValidate, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const requestBody = request.body;
        const signInRequest = new UsersSignInRequest(
            requestBody.username,
            requestBody.kakao_talk_chatting_url,
            requestBody.role);

        const findUsers = await userService.getUsersByUsername(signInRequest.username);
        if(findUsers.length === 0){
            const saveUsers = await userService.signIn(signInRequest);
            const accessToken = await userService.issueJwtToken(saveUsers[0]);
            return response.status(StatusCodes.CREATED).send(new UsersSignInResponse(accessToken));
        } else {
            const accessToken = await userService.issueJwtToken(findUsers[0]);
            return response.status(StatusCodes.OK).send(new UsersSignInResponse(accessToken));
        }

    } catch(error) {
        next(error);
    }
});

export default router;