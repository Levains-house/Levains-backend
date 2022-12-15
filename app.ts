import * as path from "path";
import cors from "cors";
import dotenv from "dotenv"; //It must be imported before express
import express, {NextFunction, Request, Response} from "express";
import morgan from "morgan";

import usersController from "./domain/users/users.controller";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger/swagger-output.json";
import healthcheckController from "./domain/healthcheck.controller";
import itemsController from "./domain/items/items.controller";

dotenv.config({
    path: path.resolve(__dirname, `env/${process.env.NODE_ENV}.env`)
});

const app = express();

//Content-Type: application/json
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//로그 수준 설정
if(process.env.NODE_ENV === "prod"){
    app.use(morgan("common"));
} else {
    app.use(morgan("dev"));
}

app.use("/", healthcheckController);

app.use("/api/users", usersController);
app.use("/api/items", itemsController);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    console.error(`error:${error}`);
    return response.status(404).send({message: "페이지를 찾을 수 없습니다"});
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on ${process.env.SERVER_PORT}`);
});