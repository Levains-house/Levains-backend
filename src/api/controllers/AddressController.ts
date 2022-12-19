import express, {NextFunction, Request, Response} from "express";
import {appConfig} from "../config/appConfig";
import {auth} from "../middlewares/auth";
import {StatusCodes} from "http-status-codes";
import {AddressRegisterRequest} from "./requests/AddressRegisterRequest";
import {AddressRegisterValidate} from "../validators/addressRegisterValidator";

const router = express.Router();
const userService = appConfig.AddressService;

//TODO: 유저 주소 등록 API
router.post("/register", auth, AddressRegisterValidate, async (request: Request, response: Response, next: NextFunction) => {

    try {
        const userId = response.locals.token.user_id;
        const requestBody = request.body;
        await userService.register(
            new AddressRegisterRequest(
                userId,
                requestBody.address
            )
        );

        return response.sendStatus(StatusCodes.OK);
    } catch(error) {
        next(error);
    }
});

export default router;