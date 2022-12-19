import {NextFunction, Request, Response} from "express";
import {appConfig} from "../config/appConfig";
import {InvalidFieldTypeError, NotEnoughRequestDataError} from "../errors/ItemsError";
import router from "./UsersController";
import {auth} from "../middlewares/auth";
import multer from "multer";
import path from "path";
import {ItemRegisterRequest} from "./requests/ItemsRegisterRequest";

const itemService = appConfig.ItemsService;
const upload = multer({ dest: path.join(__dirname, process.env.IMAGE_UPLOAD_DESTINATION as string) });

router.post("/register", auth, upload.single('image'), async (request: Request, response: Response, next: NextFunction) => {

    const userId = response.locals.token.user_id;
    try {
        const requestBody = request.body;
        if (requestBody.name === undefined
            || requestBody.description === undefined
            || requestBody.category === undefined
            || requestBody.purpose === undefined) {
            throw new NotEnoughRequestDataError(400, "요청 파라미터가 부족합니다");
        }

        if(requestBody.purpose === "SHARE"){
            if(request.file === undefined){
                throw new NotEnoughRequestDataError(400, "요청 파라미터가 부족합니다");
            }
            const fileData: Express.Multer.File = request.file;
            const fileContent = await itemService.uploadImageToS3(fileData);
            await itemService.registerItem(
                new ItemRegisterRequest(
                    userId,
                    requestBody.purpose,
                    requestBody.category,
                    requestBody.name,
                    requestBody.description,
                    fileContent[0],
                    fileContent[1]
                )
            )
        } else if(requestBody.purpose === "WANT"){
            await itemService.registerItem(
                new ItemRegisterRequest(
                    userId,
                    requestBody.purpose,
                    requestBody.category,
                    requestBody.name,
                    requestBody.description,
                    "",
                    ""
                )
            )
        } else {
            throw new InvalidFieldTypeError(400, "부적절한 요청 타입입니다");
        }

        return response.sendStatus(200);

    } catch(error) {
        next(error);
    }
});

router.put("/status", auth, async (request: Request, response: Response, next: NextFunction) => {

    try {
        const requestBody = request.body;
        if (requestBody.item_id === undefined
            || requestBody.trade_status === undefined) {
            throw new NotEnoughRequestDataError(400, "요청 파라미터가 부족합니다");
        }

        await itemService.updateItemTradeStatus(
            requestBody.item_id,
            requestBody.trade_status);

        return response.sendStatus(200);

    } catch(error) {
        next(error);
    }
});

export default router;