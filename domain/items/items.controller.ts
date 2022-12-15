import {NextFunction, Request, Response} from "express";
import {appConfig} from "../../config/app.config";
import {NotEnoughRequestDataError} from "./items.error";
import router from "../users/users.controller";
import {auth} from "../../middleware/auth";
import multer from "multer";
import path from "path";
import {ItemRegisterRequest} from "./dto/items.register.dto";

const itemService = appConfig.ItemService;
const upload = multer({ dest: path.join(__dirname, '../../uploads/') });

router.post("/register", auth, upload.single('image'), async (request: Request, response: Response, next: NextFunction) => {

    const userId = response.locals.token.user_id;
    try {
        const requestBody = request.body;
        if (request.file === undefined
            || requestBody.name === undefined
            || requestBody.description === undefined
            || requestBody.category === undefined
            || requestBody.purpose === undefined) {
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