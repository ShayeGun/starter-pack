import { catchAsync } from "../utils/catch-async";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { redis } from "../utils/cache-redis";
import { CustomError } from "../utils/custom-error";
import { PostRequest } from "../utils/request-class/post-request";
import { createTokens } from "../utils/jwt-tokens";
import { verify } from "jsonwebtoken";
import { resetRefreshToken } from "../utils/refresh-token";

export const preRegisterUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.body;

    let user = await User.findOne({ phoneNumber });
    if (!user) user = await User.create({ phoneNumber });

    const existedOtp = await redis.get(`OTP_${phoneNumber as string}`);
    if (existedOtp) return next(new CustomError('you have already requested for an otp', 400, 100));

    const newOtp = generateRandomNumber(process.env.OTP_LENGTH!);

    const sms = await sendSms(phoneNumber as string, newOtp);

    await redis.set(`OTP_${phoneNumber as string}`, newOtp, 'EX', +process.env.REDIS_TTL!);

    res.json({ data: sms });
});

// TODO: what if the person rapidly send requests to this endpoint ???
export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, otp } = req.body;
    const existedOtp = await redis.get(`OTP_${phoneNumber as string}`);

    if (!existedOtp) return next(new CustomError('call this endpoint first /user/pre-register <POST>', 400, 101));
    if (existedOtp !== otp) return next(new CustomError('invalid otp', 400, 102));

    // remove DDOS <I THINK O_o>
    await redis.del(`OTP_${phoneNumber as string}`);

    const user = await User.findOne({ phoneNumber });

    const [accessToken, refreshToken] = createTokens(user);

    user!.refreshToken = refreshToken;
    await user?.save();

    res.json({ data: { accessToken, refreshToken } });
});

export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken, accessToken, phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user) return next(new CustomError('call this endpoint first /user/pre-register <POST>', 400, 101));
    try {
        const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);

        return res.json({ data: { accessToken } });

    } catch (err: any) {
        if (err?.name === "TokenExpiredError") {
            const data = await resetRefreshToken(refreshToken, process.env.REFRESH_TOKEN_TOKEN_SECRET!, user);
            return res.json({ data });
        }
        return next(new CustomError(err.message, 400, 110));
    }

});

// =============================================================================
// ============================= UTILITY FUNCTIONS =============================
// =============================================================================

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