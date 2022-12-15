import express, {NextFunction, Request, Response} from "express";
import {appConfig} from "../../config/app.config";
import {NotEnoughRequestDataError} from "./users.error";
import {AddressCreateRequest, SignInRequest, SignInResponse} from "./dto/users.signin.dto";
import {auth} from "../../middleware/auth";
import {ProfileResponse} from "./dto/users.profiles.dto";

const router = express.Router();
const userService = appConfig.UserService;
const userModel = appConfig.UserModel;

router.get("/", auth, async (request: Request, response: Response, next: NextFunction) => {
    const userId = response.locals.token.user_id;
    const role = response.locals.token.role;
    const range = Number(request.params.range);
    try {
        const categoryItems = await userService
            .getWantedCategoryItems(userId, role, range);
        const ExperienceItems = await userService
            .getWantedCategoryItemsByExperience(userId, role, range);

        return response
            .status(200)
            .send({
                category_items: categoryItems,
                all_experience_items: ExperienceItems
            });
    } catch(error) {
        next(error);
    }
});

router.get("/profiles", auth, async (request: Request, response: Response, next: NextFunction) => {
    const userId = response.locals.token.user_id;
    try {
        const items = await userService.getSharedUserItemsByUserId(userId);

        const profileResponses = Array<ProfileResponse>();
        for(let i = 0; i < items.length; i++){
            profileResponses.push(new ProfileResponse(
                items[i].item_id,
                items[i].name,
                items[i].trade_status));
        }
        return response
            .status(200)
            .send({
                items: profileResponses
            });
    } catch(error) {
        next(error);
    }
});

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
        return response.status(500).json({message: error.message});
    }
});

export default router;