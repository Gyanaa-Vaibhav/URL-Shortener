import {redisClient} from "../cacheLayer.js";
import {CacheInterface} from "../cacheInterface";
import { logError } from "../../logger/loggerExport.js";

const client = await redisClient.getInstance();

/**
 * CacheSetter handles all Redis 'set-type' operations.
 *
 * Supported Operations:
 * - set: Basic key-value setting
 * - setWithExpiry: Set key-value with expiration
 * - hSet: Set field in a hash
 * - lSet: Set value at a specific index in a list
 * - incr: Increment numeric value of a key
 * - decr: Decrement numeric value of a key
 *
 * @example
 * const cache = new CacheSetter();
 * await cache.query({ type: 'set', key: 'foo', value: 'bar' });
 * await cache.query({ type: 'set', key: 'temp', value: '123', expiry: 60 });
 * await cache.query({ type: 'hset', key: 'user:1', field: 'name', value: 'John' });
 * await cache.query({ type: 'lset', key: 'mylist', index: 0, value: 'first' });
 * await cache.query({ type: 'incr', key: 'counter' });
 * await cache.query({ type: 'decr', key: 'counter' });
 */
class CacheSetter implements CacheInterface {
    private cache = client;

    public async query(data: {
        key: string;
        value?: string;
        expiry?: number;
        field?: string;
        index?: number;
        type?: 'set' | 'hset' | 'lset' | 'incr' | 'decr';
    }): Promise<any> {
        const { key, value, expiry, field, index, type } = data;

        switch (type) {
            case 'hset':
                if (!field || value === undefined) {
                    logError("Field and value are required for HSET.");
                    throw new Error("Field and value are required for HSET.");
                }
                return await this.hSet(key, field, value);
            case 'lset':
                if (index === undefined || value === undefined) {
                    logError("Index and value are required for LSET.");
                    throw new Error("Index and value are required for LSET.");
                }
                return await this.lSet(key, index, value);
            case 'incr':
                return await this.incr(key);
            case 'decr':
                return await this.decr(key);
            case 'set':
            default:
                if (!key || value === undefined) {
                    logError("Key and value are required for SET.");
                    throw new Error("Key and value are required for SET.");
                }
                if (expiry) {
                    return await this.setWithExpiry(key, value, expiry);
                } else {
                    return await this.set(key, value);
                }
        }
    }

    private async set(key: string, value: string) {
        return await this.cache.set(key, value);
    }

    private async setWithExpiry(key: string, value: string, expiry: number) {
        return await this.cache.set(key, value, { EX: expiry });
    }

    private async hSet(key: string, field: string, value: string) {
        return await this.cache.hSet(key, field, value);
    }

    private async lSet(key: string, index: number, value: string) {
        return await this.cache.lSet(key, index, value);
    }

    private async incr(key: string) {
        return await this.cache.incr(key);
    }

    private async decr(key: string) {
        return await this.cache.decr(key);
    }
}

export const cacheSetter = new CacheSetter();
await cacheSetter.query({key:"key", value:"value234"})
await cacheSetter.query({type:'incr',key:"counter"})