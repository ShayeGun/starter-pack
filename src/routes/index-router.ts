import { Router } from "express";
import { testController } from "../controllers";
const router = Router();

router.route('/test')
    .all(testController);

export { router as mainRouter };