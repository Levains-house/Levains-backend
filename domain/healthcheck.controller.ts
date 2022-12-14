import {Request, Response} from "express";
import router from "./users/users.controller";

router.get("/", async (request: Request, response: Response) => {
    return response.sendStatus(200);
});

export default router;