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
            || requestBody.name
            || requestBody.category
            || requestBody.item_type) {
            throw new NotEnoughRequestDataError(400, "요청 파라미터가 부족합니다");
        }

        const fileData: Express.Multer.File = request.file;
        const fileContent = await itemService.uploadImageToS3(fileData);
        await itemService.registerItem(
            new ItemRegisterRequest(
                userId,
                requestBody.item_type,
                requestBody.category,
                requestBody.name,
                fileContent[0],
                fileContent[1]
            )
        )

        return response.sendStatus(200);

    } catch(error) {
        next(error);
    }
});

export default router;