import { catchAsync } from "../utils/catch-async";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

export const preRegisterUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.body;
    const user = await User.create({ phoneNumber });
    res.json(user);
});
