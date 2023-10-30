import { sign } from "jsonwebtoken";

interface IToken {
    accessSecret: string,
    accessExpire: number,
    refreshSecret: string,
    refreshExpire: number,
}

export function createTokens<T extends IToken>(payload: any, opt: Partial<T> = {}) {
    const accessSecret = opt.accessSecret || process.env.ACCESS_TOKEN_SECRET! || 'secret';
    const accessExpire = opt.accessExpire || +process.env.ACCESS_TOKEN_EXPIRATION! || 3600;
    const refreshSecret = opt.refreshSecret || process.env.REFRESH_TOKEN_TOKEN_SECRET! || 'very_secret';
    const refreshExpire = opt.refreshExpire || +process.env.REFRESH_TOKEN_EXPIRATION! || 7200;

    const accessToken = sign({
        payload,
        exp: Math.floor(Date.now() / 1000) + accessExpire
    }, accessSecret);

    const refreshToken = sign({
        payload,
        exp: Math.floor(Date.now() / 1000) + refreshExpire
    }, refreshSecret);

    return [accessToken, refreshToken];
}