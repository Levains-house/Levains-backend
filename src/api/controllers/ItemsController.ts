import {NextFunction, Request, Response} from "express";
import {appConfig} from "../config/appConfig";
import {NotEnoughRequestDataError} from "../errors/ItemsError";
import router from "./UsersController";
import {auth} from "../middlewares/auth";
import multer from "multer";
import path from "path";
import {ItemRegisterRequest} from "./requests/ItemsRegisterRequest";
import {itemRegisterValidator} from "../validators/itemRegisterValidator";
import {ItemPurpose} from "../types/ItemPurpose";
import {StatusCodes} from "http-status-codes";
import {ERROR_MESSAGE} from "../utils/ErrorMessageProperties";
import {itemTradeStatusValidator} from "../validators/itemTradeStatusValidator";
import {MyItemsListResponse} from "./responses/MyItemsListResponse";
import {ItemTradeStatus} from "../types/ItemTradeStatus";

const itemService = appConfig.ItemsService;
const upload = multer({ dest: path.join(__dirname, process.env.IMAGE_UPLOAD_DESTINATION as string) });

//TODO: /api/items?range={range}
router.get("/", auth, async (request: Request, response: Response, next: NextFunction) => {

    try {
        const userId = response.locals.token.user_id;
        const role = response.locals.token.role;
        const range = Number(request.query.range);

    } catch(error) {

    }

    // try {
    //     const categoryItems = await userService
    //         .getWantedCategoryItems(userId, role, range);
    //     const experienceItems = await userService
    //         .getWantedCategoryItemsByExperience(userId, role, range);
    //
    //     const categoryItemsResponse = Array<CategoryItemResponse>();
    //     for(let i = 0; i < categoryItems[0].length; i++){
    //         categoryItemsResponse.push(new CategoryItemResponse(
    //             categoryItems[0][i].item_id,
    //             categoryItems[0][i].img_url,
    //             categoryItems[0][i].name,
    //             categoryItems[0][i].description,
    //             categoryItems[0][i].category,
    //             categoryItems[0][i].kakao_talk_chatting_url,
    //             categoryItems[1].name,
    //             categoryItems[1].description,
    //             categoryItems[1].category
    //         ))
    //     }
    //
    //     const experienceItemsResponse = Array<ExperienceItemResponse>();
    //     experienceItems.map(e => experienceItemsResponse.push(e));
    //     return response
    //         .status(200)
    //         .send(new UserHomeResponse(
    //             categoryItemsResponse,
    //             experienceItemsResponse
    //         ));
    // } catch(error) {
    //     next(error);
    // }

}).use("/register", async (request: Request, response: Response, next: NextFunction) => {
    return response.status(StatusCodes.METHOD_NOT_ALLOWED).send({message: ERROR_MESSAGE.METHOD_NOT_ALLOWED});
});

//TODO: /api/items
router.post("/", auth,
    upload.single('image'), itemRegisterValidator, async (request: Request, response: Response, next: NextFunction) => {

    try {
        const userId = response.locals.token.user_id;
        const requestBody = request.body;
        const itemRegisterRequest = new ItemRegisterRequest(
            userId,
            requestBody.purpose,
            requestBody.category,
            requestBody.name,
            requestBody.description
        );
        //물건 나눔일때만 이미지 업로드
        if(requestBody.purpose === ItemPurpose.SHARE.toString()){
            if(request.file === undefined){
                throw new NotEnoughRequestDataError(StatusCodes.BAD_REQUEST, ERROR_MESSAGE.BAD_REQUEST_1);
            }
            const fileData: Express.Multer.File = request.file;
            const fileContent = await itemService.uploadImageToS3(fileData);
            itemRegisterRequest.img_name = fileContent.img_name;
            itemRegisterRequest.img_url = fileContent.img_url;
        }

        await itemService.register(itemRegisterRequest);

        return response.sendStatus(StatusCodes.OK);
    } catch(error) {
        next(error);
    }
}).use("/register", async (request: Request, response: Response, next: NextFunction) => {
    return response.status(StatusCodes.METHOD_NOT_ALLOWED).send({message: ERROR_MESSAGE.METHOD_NOT_ALLOWED});
});

//TODO: /api/items/my-list
router.get("/my-list", auth, async (request: Request, response: Response, next: NextFunction) => {

    try {
        const userId = response.locals.token.user_id;
        const findItems = await itemService.getMyItemsList(userId);

        const myItemsListResponse = findItems.map(i => new MyItemsListResponse(
            i.item_id as bigint,
            i.name as string,
            i.trade_status as ItemTradeStatus
        ));

        console.log(myItemsListResponse[0].name);

        return response
            .status(StatusCodes.OK)
            .send({
                items: myItemsListResponse
            });
    } catch(error) {
        next(error);
    }

}).use("/my-list", async (request: Request, response: Response, next: NextFunction) => {
    return response.status(StatusCodes.METHOD_NOT_ALLOWED).send({message: ERROR_MESSAGE.METHOD_NOT_ALLOWED});
});

//TODO: /api/items/my-list/trade_status
router.put("/my-list/trade-status", auth, itemTradeStatusValidator, async (request: Request, response: Response, next: NextFunction) => {

    try {
        const requestBody = request.body;
        await itemService.updateTradeStatus(requestBody.item_id, requestBody.trade_status);

        return response.sendStatus(200);

    } catch(error) {
        next(error);
    }
}).use("/my-list/trade-status", async (request: Request, response: Response, next: NextFunction) => {
    return response.status(StatusCodes.METHOD_NOT_ALLOWED).send({message: ERROR_MESSAGE.METHOD_NOT_ALLOWED});
});

export default router;