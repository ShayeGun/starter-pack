import { catchAsync } from "../utils/catch-async";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { redis } from "../utils/cache-redis";
import { CustomError } from "../utils/custom-error";
import { PostRequest } from "../utils/request-class/post-request";

export const preRegisterUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.body;
    const user = await User.create({ phoneNumber });
    res.json({ data: user });
});

export const cacheOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.query;

    const existedOtp = await redis.get(phoneNumber as string);
    if (existedOtp) return next(new CustomError('you have already requested for an otp', 400, 101));

    const newOtp = generateRandomNumber(process.env.OTP_LENGTH!);

    const sms = await sendSms(phoneNumber as string, newOtp);

    await redis.set(phoneNumber as string, newOtp, 'EX', +process.env.REDIS_TTL!);

    res.json({ data: sms });
});

async function sendSms(phoneNumber: string, message: string) {
    const otpRequest = new PostRequest(process.env.OTP_URL);

    otpRequest
        .setHeader({ "Content-Type": "application/json" })
        .setBody({
            data: {
                username: process.env.OTP_USERNAME,
                password: process.env.OTP_PASSWORD,
                to: phoneNumber,
                msg: message
            }
        });
    const response = await otpRequest.call();

    return response;
};

function generateRandomNumber(length: number | string): string {
    const len = +length;
    const numberList = [..."0123456789"]; // array of numbers
    const numberListLength = numberList.length;
    let otp: string = '';

    for (let i = 0; i < len; i++) {
        const randomNumber = numberList[Math.floor(Math.random() * numberListLength)];
        otp += randomNumber;
    }

    return otp;
}