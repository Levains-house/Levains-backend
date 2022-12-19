import express, {NextFunction, Request, Response} from "express";
import {appConfig} from "../config/appConfig";
import {auth} from "../middlewares/auth";
import {CategoryItemResponse, ExperienceItemResponse, UserHomeResponse} from "./responses/UsersItemsResponse";
import {StatusCodes} from "http-status-codes";
import {signInValidate} from "../validators/userSignInValidator";
import {UsersSignInResponse} from "./responses/UsersSignInResponse";
import {UsersSignInRequest} from "./requests/UsersSignInRequest";
import {ERROR_MESSAGE} from "../utils/ErrorMessageProperties";

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

//TODO: 유저 로그인, 회원가입 API
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
}).use("/sign-in", async (request: Request, response: Response, next: NextFunction) => {
    return response.status(StatusCodes.METHOD_NOT_ALLOWED).send({message: ERROR_MESSAGE.METHOD_NOT_ALLOWED});
});;

export default router;