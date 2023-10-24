import { Router } from "express";
import { AuthController } from "../controllers";
import { genericValidator, FieldType } from "../middlewares/request-checker";
import * as Dto from '../utils/validator-checker/index';
const router = Router();

router.route('/user/pre-register')
    .post(genericValidator(Dto.CreateUserDto), AuthController.preRegisterUser);

router.route('/user/otp')
    .get(genericValidator(Dto.CreateUserDto, FieldType.QUERY), AuthController.cacheOtp);

export { router as mainRouter };