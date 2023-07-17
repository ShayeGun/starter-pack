import Joi from "joi"

const persianRegex = /^[آ-ی]+$/
const englishRegex = /^[a-zA-Z]+$/
const stringyNumberRegex = /^[0-9]+$/
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,30}$/
const phoneRegex = /^09[0-9]{9}$/


const userSchema = Joi.object({
    Name: Joi.string().pattern(new RegExp(persianRegex)).min(3).max(30).required(),

    LastName: Joi.string().pattern(new RegExp(persianRegex)).min(3).max(30).required(),

    EnName: Joi.string().pattern(new RegExp(englishRegex)).min(3).max(30).required(),

    EnLastName: Joi.string().pattern(new RegExp(englishRegex)).min(3).max(30).required(),

    Password: Joi.string()
        .pattern(new RegExp(passwordRegex)).required().message('password must be at least 8 characters and with a symbol, number, lower and upper-case letters'),

    NationalCode: Joi.string()
        .pattern(new RegExp(stringyNumberRegex)).length(10).required(),

    IsMan: Joi.boolean().default(true),

    IsForeign: Joi.boolean().default(false),

    PostalCode: Joi.string()
        .pattern(new RegExp(stringyNumberRegex)).min(1).max(10).required(),

    Telephone: Joi.string()
        .pattern(new RegExp(phoneRegex)).length(11).required(),

    BirthCertificateID: Joi.string()
        .pattern(new RegExp(stringyNumberRegex)).min(1).max(10).required(),

    BirthDate: Joi.date().min('1-1-1930').less('now').required(),

    Email: Joi.string().email().required()
})

const result = userSchema.validate(
    {
        "Name": "شایگان",
        "LastName": "عموئی",
        "EnName": "Shayegan",
        "EnLastName": "Amouei",
        "NationalCode": "0022553975",
        "IsMan": true,
        "PostalCode": "3134764436",
        "Telephone": "09384009969",
        "IsForeign": false,
        "BirthCertificateID": "022553975",
        "BirthDate": "1999/9/12",
        "City": "تهران",
        "ProvinceName": "تهران"
    }
)
console.log('result: ', result);

export { userSchema }