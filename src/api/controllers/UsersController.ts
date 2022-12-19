import express, {NextFunction, Request, Response} from "express";
import {appConfig} from "../config/appConfig";
import {NotEnoughRequestDataError} from "../errors/UsersError";
import {AddressCreateRequest, SignInRequest, SignInResponse} from "./responses/UsersSigninRequest";
import {auth} from "../middlewares/auth";
import {ProfileResponse} from "./responses/UsersProfilesResponse";
import {CategoryItemResponse, ExperienceItemResponse, UserHomeResponse} from "./responses/UsersItemsResponse";
import {StatusCodes} from "http-status-codes";
import {signInValidate} from "../validators/SignInValidator";

const router = express.Router();
const userService = appConfig.UsersService;

router.get("/", auth, async (request: Request, response: Response, next: NextFunction) => {
    const userId = response.locals.token.user_id;
    const role = response.locals.token.role;
    const range = Number(request.query.range);
    try {
        const categoryItems = await userService
            .getWantedCategoryItems(userId, role, range);
        const experienceItems = await userService
            .getWantedCategoryItemsByExperience(userId, role, range);

        console.log(userId);

        const categoryItemsResponse = Array<CategoryItemResponse>();
        for(let i = 0; i < categoryItems[0].length; i++){
            categoryItemsResponse.push(new CategoryItemResponse(
                categoryItems[0][i].item_id,
                categoryItems[0][i].img_url,
                categoryItems[0][i].name,
                categoryItems[0][i].description,
                categoryItems[0][i].category,
                categoryItems[0][i].kakao_talk_chatting_url,
                categoryItems[1].name,
                categoryItems[1].description,
                categoryItems[1].category
            ))
        }

        const experienceItemsResponse = Array<ExperienceItemResponse>();
        experienceItems.map(e => experienceItemsResponse.push(e));
        return response
            .status(200)
            .send(new UserHomeResponse(
                categoryItemsResponse,
                experienceItemsResponse
            ));
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


router.post("/sign-in", signInValidate, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const requestBody = request.body;
        const signInRequest = new SignInRequest(
            requestBody.username,
            requestBody.kakao_talk_chatting_url,
            requestBody.role);

        const findUsers = await userService.getUsersByUsername(signInRequest.username);
        if(findUsers.length === 0){
            const saveUsers = await userService.signIn(signInRequest);
            const accessToken = await userService.issueJwtToken(saveUsers[0]);
            return response.status(StatusCodes.CREATED).send(new SignInResponse(accessToken));
        } else {
            const accessToken = await userService.issueJwtToken(findUsers[0]);
            return response.status(StatusCodes.OK).send(new SignInResponse(accessToken));
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