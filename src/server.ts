import { app } from './app';
import env from 'dotenv';
import mongoose from "mongoose";
import { checkEnvVar } from './utils/check-environment-variables';

// extend Request object fields for Express
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

env.config({ path: `${__dirname}/../.env` });

// environment variables check
checkEnvVar(
    'APP_PORT',
    'MONGODB_URL',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'REDIS_URL',
    'REDIS_PORT',
    'REDIS_PASSWORD',
    'REDIS_TTL',
);

mongoose.connect(process.env.MONGODB_URL!,
    {
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
        dbName: process.env.DB_NAME
    }
).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error('MongoDB connection error', err);
});

const port = process.env.APP_PORT || 7892;

const server = app.listen(port, () => {
    console.log(`listening on port ${port} ...`);
});

process.on('unhandledRejection', (err: Error) => {
    console.log(err.name, err.message);

    server.close(() => {
        console.log('App in shutting down ❌');

        process.exit(1);
    });
});