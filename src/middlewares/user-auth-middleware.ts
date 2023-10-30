import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catch-async";
import { User } from "../models/user.model";
import { CustomError } from "../utils/custom-error";
import { JwtPayload, verify } from "jsonwebtoken";

export const authUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const tokenType = authHeader ? authHeader.split(" ")[0] : "";
    const tokenValue = authHeader ? authHeader.split(" ")[1] : "";
    if (!authHeader || tokenType !== "Bearer") return next(new CustomError("invalid token", 401, 110));

    const data = verify(tokenValue, process.env.ACCESS_TOKEN_SECRET!);

    const existedUser = await User.findById((data as JwtPayload).payload.id);
    if (!existedUser?.refreshToken) return next(new CustomError("please login!", 400, 111));

    req.user = (data as JwtPayload).payload;

    next();
});