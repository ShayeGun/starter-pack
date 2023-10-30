import Joi from "joi";

const phoneRegex = /^09[0-9]{9}$/;
// const stringyNumberRegex = /^[0-9]+$/;
// const dateRegex = /^\d{4}\-\d{2}\-\d{2}$/;

const CreateUserDto = Joi.object({
    phoneNumber: Joi.string()
        .pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
});

export { CreateUserDto };