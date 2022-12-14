import express, {NextFunction, Request, Response} from "express";
import {appConfig} from "../../config/app.config";
import {NotEnoughRequestDataError} from "./items.error";
import router from "../users/users.controller";
import {auth} from "../../middleware/auth";
import multer from "multer";
import {multerConfig} from "../../config/multer.config";

const upload = multer(multerConfig);

router.post("/register", upload.single('image'), async (request: Request, response: Response, next: NextFunction) => {

    try {

        const requestBody = request.body;
        if (request.file === undefined
            || requestBody.name
            || requestBody.category) {
            throw new NotEnoughRequestDataError(400, "요청 파라미터가 부족합니다");
        }
        if(request.file !== undefined){
            const fileData: Express.Multer.File = request.file;
            console.log(fileData);
            console.log(request.body.hello);
            return response.sendStatus(200);
        } else {
            return response.sendStatus(500);
        }

    } catch(error) {
        next(error);
    }
});

export default router;