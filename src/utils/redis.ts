import { Redis } from "ioredis";
import { redisConfig } from "config/redis";
import IORedis from "ioredis";

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new IORedis({
      host: redisConfig.host,
      port: Number(redisConfig.port),
      password: redisConfig.password,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }
  return redisClient;
};
