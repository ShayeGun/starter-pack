import env from 'dotenv';
import { Redis } from "ioredis";

env.config({ path: `${__dirname}/../../.env` });

interface ICache {
    host: string;
    port: number;
    password: string;
}

class CacheRedis extends Redis {
    private static _instance: Redis;

    private constructor() {
        super();
    }

    static getInstance<T extends Partial<ICache>>(connectionConfig: T) {
        if (this._instance) {
            return this._instance;
        }

        console.log("connected to Redis");
        this._instance = new Redis(connectionConfig);
        return this._instance;
    }
}

const redis = CacheRedis.getInstance({
    host: process.env.REDIS_URL,
    port: +process.env.REDIS_PORT!,
    password: process.env.REDIS_PASSWORD
});

export { redis };