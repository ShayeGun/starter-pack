import { Router } from "express";
import { AuthController } from "../controllers";
import { genericValidator } from "../middlewares/request-checker";
import * as Dto from '../utils/validator-checker/index';
const router = Router();

router.route('/user/pre-register')
    .post(genericValidator(Dto.CreateUserDto), AuthController.preRegisterUser);

export { router as mainRouter };