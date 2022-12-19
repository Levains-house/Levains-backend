import * as path from "path";
import cors from "cors";
import dotenv from "dotenv";
import express, {NextFunction, Request, Response} from "express";
import morgan from "morgan";

import usersController from "./api/controllers/UsersController";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger/swagger-output.json";
import healthcheckController from "./api/controllers/HealthCheckController";
import itemsController from "./api/controllers/ItemsController";
import {StatusCodes} from "http-status-codes";
import addressController from "./api/controllers/AddressController";
import {ERROR_MESSAGE} from "./api/utils/ErrorMessageProperties";

dotenv.config({
    path: path.resolve(__dirname, `../env/${process.env.NODE_ENV}.env`)
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//로그 수준 설정
if(process.env.NODE_ENV === "prod"){
    app.use(morgan("common"));
} else {
    app.use(morgan("dev"));
}

app.use("/api/users", usersController);
app.use("/api/address", addressController);
app.use("/api/items", itemsController);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/api/health-check", healthcheckController);

app.use((error: Error | any, request: Request, response: Response, next: NextFunction) => {
    console.error(`error:${error}`);
    if(error instanceof SyntaxError){
        return response.status(StatusCodes.BAD_REQUEST).send({message: ERROR_MESSAGE.BAD_REQUEST_2});
    } else {
        return response.status(error.code).send({message: error.message});
    }
});

app.use("*", (request: Request, response: Response, next: NextFunction) => {
    return response.status(StatusCodes.NOT_FOUND).send({message: ERROR_MESSAGE.NOT_FOUND});
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on ${process.env.SERVER_PORT}`);
});