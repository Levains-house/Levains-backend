import express, {NextFunction, Request, Response} from "express";
import {appConfig} from "../../config/app.config";
import {NotEnoughRequestDataError} from "./users.error";
import {AddressCreateRequest, SignInRequest, SignInResponse} from "./dto/users.signin.dto";
import {auth} from "../../middleware/auth";

const router = express.Router();
const userService = appConfig.UserService;

router.post("/sign-in", async (request: Request, response: Response, next: NextFunction) => {
    const requestBody = request.body;
    try {
        if(requestBody.username === undefined
            || requestBody.kakao_talk_chatting_url === undefined
            || requestBody.role === undefined){
            throw new NotEnoughRequestDataError(400, "요청 파라미터가 부족합니다");
        }

        const signInRequest = new SignInRequest(
            requestBody.username,
            requestBody.kakao_talk_chatting_url,
            requestBody.role);
        const isNewUser: boolean = await userService.isNewUser(signInRequest);
        if(isNewUser){
            const accessToken: string =
                await userService.signIn(signInRequest);
            return response.status(201)
                .send(new SignInResponse(accessToken));
        } else {
            const accessToken: string =
                await userService.reIssueJwtToken(signInRequest);
            return response.status(200)
                .send(new SignInResponse(accessToken));
        }
    } catch(error) {
        next(error);
    }
});

router.post("/sign-in/address", auth, async (request: Request, response: Response, next: NextFunction) => {
    const userId = response.locals.token.user_id;
    const requestBody = request.body;
    try {
        if(requestBody.address === undefined){
            throw new NotEnoughRequestDataError(400, "요청 파라미터가 부족합니다");
        }

        await userService.createAddress(
            new AddressCreateRequest(
                userId,
                requestBody.address
            )
        );

        return response.sendStatus(200);

    } catch(error) {
        next(error);
    }
});

router.use((error: Error, request: Request, response: Response, next: NextFunction) => {

    if(error instanceof NotEnoughRequestDataError){
        return response.status(error.code).json({message: error.message});
    }  else {
        return response.status(500).json({message: "서버 내부 오류입나다"});
    }
});

export default router;