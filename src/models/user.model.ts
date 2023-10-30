import { Model, model, Schema } from 'mongoose';
import validator from 'validator';

enum Roles {
    user = "user",
    admin = "admin"
}

export interface IUser {
    phoneNumber: string;
    refreshToken?: string;
    role: Roles;
}

export interface IUserMethods { }

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    phoneNumber: {
        type: String,
        required: true,
        maxlength: 11,
        minlength: 11,
        validate: [validator.isMobilePhone, 'not valid phone number']
    },
    refreshToken: {
        type: String,
    },
    role: {
        type: String,
        enum: Roles,
        default: Roles.user
    }
}, {
    toJSON: {
        // convert _id to id
        virtuals: true,
        // remove __v
        versionKey: false,
        // remove _id 
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.refreshToken;
            // delete ret.__v;
        }
    },
});

// searches are based on national-code and mobile-number
userSchema.index({ phoneNumber: 1 }, { unique: true });

const User = model<IUser, UserModel>('User', userSchema);

export { User };