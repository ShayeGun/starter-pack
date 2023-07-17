import { Model, model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

enum Roles {
    user = "user",
    admin = "admin"
}

interface IUser {
    Name: string;
    LastName: string;
    EnName: string;
    EnLastName: string;
    Password: string;
    NationalCode: string;
    IsMan: boolean;
    IsForeign: boolean;
    PostalCode: string;
    Telephone: string;
    BirthCertificateID: string;
    BirthDate: string;
    Email: string;
    Role: Roles;
}

interface IUserMethods {
    correctPassword(password: any): string
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    Name: { type: String, required: true },
    LastName: { type: String, required: true },
    EnName: { type: String, required: true },
    EnLastName: { type: String, required: true },
    Password: {
        type: String,
        required: true,
        select: false,
        validate: [{
            validator: function checkPassword(str: string) {
                var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                return re.test(str);
            },
            message: 'password must be at least 8 characters and with a symbol, number, lower and upper-case letters'
        }]
    },
    NationalCode: {
        type: String, required: true,
        unique: true,
        maxlength: 10,
        minlength: 10,
        validate: [validator.isNumeric, 'not valid national-code']
    },
    IsMan: {
        type: Boolean,
        default: true
    },
    IsForeign: {
        type: Boolean,
        default: false
    },
    PostalCode: {
        type: String, required: true,
        maxlength: 10,
        minlength: 10,
        validate: [validator.isNumeric, 'not valid postal-code']
    },
    Telephone: {
        type: String, required: true, unique: true,
        maxlength: 11,
        minlength: 11,
        validate: [validator.isMobilePhone, 'not valid phone number']
    },
    BirthCertificateID: {
        type: String, required: true,
        maxlength: 10,
        minlength: 1,
        validate: [validator.isNumeric, 'not valid birth certificate id']
    },
    BirthDate: {
        type: String,
        required: true
    },
    Email: {
        type: String, required: true, unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'not valid email']
    },
    Role: {
        type: String,
        enum: Roles,
        default: Roles.user
    }
});

userSchema.method('correctPassword', async function correctPassword(userPass) {
    const bcryptPass = this.Password
    return await bcrypt.compare(userPass, bcryptPass);
})


userSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.Password = await bcrypt.hash(this.Password, salt);

    next();
});

const User = model<IUser, UserModel>('User', userSchema);

export { User }