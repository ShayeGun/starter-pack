import Joi from "joi";

const jwtRegex = /^[\w-]+\.[\w-]+\.[\w-]+$/;
const phoneRegex = /^09[0-9]{9}$/;

const RefreshTokenDto = Joi.object({

    phoneNumber: Joi.string()
        .pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
    accessToken: Joi.string()
        .pattern(new RegExp(jwtRegex)).message('invalid access token').required(),
    refreshToken: Joi.string()
        .pattern(new RegExp(jwtRegex)).message('invalid refresh token').required(),
});

export { RefreshTokenDto };