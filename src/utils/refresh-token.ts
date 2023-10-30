import { verify } from 'jsonwebtoken';
import { IUser, IUserMethods } from '../models/user.model';
import { Document, Types } from 'mongoose';
import { createTokens } from './jwt-tokens';
import { CustomError } from './custom-error';

export function resetRefreshToken(token: string,
    secretKey: string,
    user: Document<unknown, {}, IUser> &
        Omit<IUser & { _id: Types.ObjectId; }, never>
        & IUserMethods) {
    return new Promise(async (resolve, reject) => {
        verify(token, secretKey, {}, async (err, decode) => {
            if (err) {
                user.refreshToken = "";
                await user.save();
                return reject(new CustomError("please login!", 400, 111));
            }

            if (user.refreshToken !== token) {
                user.refreshToken = "";
                await user.save();
                return reject(new CustomError("sth fishy is happening here...", 400, 112));
            }

            const [accessToken, refreshToken] = createTokens(user);
            user.refreshToken = refreshToken;
            await user.save();
            return resolve({ accessToken, refreshToken });
        });
    });
}