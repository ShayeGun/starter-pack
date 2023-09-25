import { Router } from "express";

const router = Router();

router.route('/test')
    .all();

export { router as mainRouter };