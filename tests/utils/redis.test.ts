jest.mock("ioredis", () => require("ioredis-mock"));

import { getRedisClient } from "../../src/utils/redis";

describe("getRedisClient with ioredis-mock", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should return working Redis client", async () => {
    const redis = getRedisClient();

    await redis.set("foo", "bar");
    const result = await redis.get("foo");

    expect(result).toBe("bar");
  });

  it("should return same instance on multiple calls", () => {
    const r1 = getRedisClient();
    const r2 = getRedisClient();
    expect(r1).toBe(r2);
  });

  afterAll(async () => {
    const client = getRedisClient();
    await client.quit();
  });
});
