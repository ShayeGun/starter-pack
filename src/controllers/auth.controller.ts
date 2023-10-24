import { catchAsync } from "../utils/catch-async";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { redis } from "../utils/cache-redis";

export const preRegisterUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.body;
    const user = await User.create({ phoneNumber });
    res.json(user);
});

export const cacheOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.query;
    await redis.set(phoneNumber as string, '123', 'EX', +process.env.REDIS_TTL!);
    const v = await redis.get(phoneNumber as string);
    res.json({ data: v });
});
