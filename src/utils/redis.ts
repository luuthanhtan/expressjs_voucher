import { Redis } from "ioredis";
import { redisConfig } from "config/redis";
import IORedis from "ioredis";

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new IORedis({
      host: redisConfig.host || "127.0.0.1",
      port: parseInt(redisConfig.port || "6379", 10),
      password: redisConfig.password || undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }
  return redisClient;
};
