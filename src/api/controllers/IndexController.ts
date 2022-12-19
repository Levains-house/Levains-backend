import {Request, Response} from "express";
import router from "./UsersController";

router.get("/api/health-check", async (request: Request, response: Response) => {
    return response.sendStatus(200);
});

export default router;