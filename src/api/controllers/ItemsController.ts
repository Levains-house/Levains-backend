import {NextFunction, Request, Response} from "express";
import {appConfig} from "../config/appConfig";
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
import {ExperienceItem, ItemsListResponse, RecommendAndOppositeWantedItem} from "./responses/ItemsListResponse";
import {itemListValidator} from "../validators/itemListValidator";
import {NotEnoughRequestDataError} from "../errors/CommonError";

const itemService = appConfig.ItemsService;
const upload = multer({ dest: path.join(__dirname, process.env.IMAGE_UPLOAD_DESTINATION as string) });

//TODO: [GET] /api/items?range={range}
router.get("/", auth, itemListValidator, async (request: Request, response: Response, next: NextFunction) => {

    try {
        const userId = response.locals.token.user_id;
        const role = response.locals.token.role;
        const kakaoTalkChattingUrl = response.locals.token.kakao_talk_chatting_url;
        const range = Number(request.query.range);

        const recommendAndOppositeWantedItems = await itemService.getRecommendItemsList(userId, role, range);
        const experienceItems = await itemService.getRecommendExperienceItemsList(userId, role, range);

        const recommendAndOppositeWantedItemsResponse = Array<RecommendAndOppositeWantedItem>();
        for(let i = 0; i < recommendAndOppositeWantedItems.recommend_items.length; i++){
            const random = Math.floor(Math.random() * recommendAndOppositeWantedItems
                .opposite_wanted_items.length);
            const wantedItems = recommendAndOppositeWantedItems.opposite_wanted_items[random];
            recommendAndOppositeWantedItemsResponse.push(new RecommendAndOppositeWantedItem(
                recommendAndOppositeWantedItems.recommend_items[i].item_id,
                recommendAndOppositeWantedItems.recommend_items[i].img_url,
                recommendAndOppositeWantedItems.recommend_items[i].name,
                recommendAndOppositeWantedItems.recommend_items[i].description,
                recommendAndOppositeWantedItems.recommend_items[i].category,
                kakaoTalkChattingUrl,
                wantedItems.name,
                wantedItems.description,
                wantedItems.category,
            ))
        }

        const experienceItemsResponse = experienceItems.map(e => new ExperienceItem(
            e.item_id,
            e.img_url,
            e.name,
            e.description,
            e.category
        ));

        return response
            .status(StatusCodes.OK)
            .send(new ItemsListResponse(
                recommendAndOppositeWantedItemsResponse,
                experienceItemsResponse
            ));
    } catch(error) {
        next(error);
    }

});

//TODO: [POST] /api/items
router.post("/", auth, upload.single('image'),
    itemRegisterValidator, async (request: Request, response: Response, next: NextFunction) => {

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
});

//TODO: [GET] /api/items/my-list
router.get("/my-list", auth, async (request: Request, response: Response, next: NextFunction) => {

    try {
        const userId = response.locals.token.user_id;
        const findItems = await itemService.getMyItemsList(userId);

        const myItemsListResponse = findItems.map(i => new MyItemsListResponse(
            i.item_id as bigint,
            i.name as string,
            i.trade_status as ItemTradeStatus
        ));

        return response
            .status(StatusCodes.OK)
            .send({
                items: myItemsListResponse
            });
    } catch(error) {
        next(error);
    }

});

//TODO: [PUT] /api/items/my-list/trade_status
router.put("/my-list/trade-status", auth, itemTradeStatusValidator, async (request: Request, response: Response, next: NextFunction) => {

    try {
        const requestBody = request.body;
        await itemService.updateTradeStatus(requestBody.item_id, requestBody.trade_status);

        return response.sendStatus(200);

    } catch(error) {
        next(error);
    }
});

export default router;