import express, {NextFunction, Request, Response} from "express";
const router = express.Router();

//TODO: [GET] /api/health-check
router.get("/", async (request: Request, response: Response, next: NextFunction) => {
    return response.sendStatus(200);
});

export default router;