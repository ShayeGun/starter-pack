import { Router } from "express";
import { AuthController } from "../controllers";
import { genericValidator, FieldType } from "../middlewares/request-checker";
import { authUser } from "../middlewares/user-auth-middleware";
import * as Dto from '../utils/validator-checker/index';
const router = Router();

router.route('/user/pre-register')
    .post(genericValidator(Dto.CreateUserDto), AuthController.preRegisterUser);

router.route('/user/signup')
    .post(genericValidator(Dto.SignupUserDto), AuthController.signup);

router.route('/user/auth')
    .all(authUser, (req, res) => {
        res.json({
            data: `${JSON.stringify(req.user)}\n you are authenticated`
        });
    });

export { router as mainRouter };