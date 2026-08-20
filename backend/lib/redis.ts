import "dotenv/config";
import Redis from "ioredis";

// Support REDIS_URL or REDIS_HOST/REDIS_PORT. If neither set, Redis is a no-op.
const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined;

let redis: Redis | null = null;

if (redisUrl) {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    retryStrategy: () => null,
  });
} else if (redisHost) {
  redis = new Redis({
    host: redisHost,
    port: redisPort ?? 6379,
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    retryStrategy: () => null,
  });

  redis.on("error", (error) => {
    console.warn(`[redis] ${error.message}`);
  });
}

export async function connectRedis() {
  if (!redis) {
    console.log('[redis] skipped: REDIS_URL not set');
    return;
  }

  try {
    await redis.connect();
    console.log(`[redis] connected to ${redisUrl}`);
  } catch (error) {
    console.warn(`[redis] unavailable: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getCachedJson<T>(key: string, fallback: () => Promise<T>, ttl = 300) {
  if (!redis) return fallback();
  if (!redis.status || (redis as any).status === "end") {
    return fallback();
  }

  let cached: string | null = null;
  try {
    cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (error) {
    console.warn(`[redis] cache read failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    const value = await fallback();
    try {
      await redis.set(key, JSON.stringify(value), "EX", ttl);
    } catch (error) {
      console.warn(`[redis] cache write failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    return value;
  } catch (fallbackErr) {
    // If the primary data source failed, attempt to return a previously cached value as a fallback.
    if (cached) {
      try {
        return JSON.parse(cached) as T;
      } catch (err) {
        console.warn(`[redis] failed to parse cached value after fallback error: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    // No cached value available; rethrow the original error
    throw fallbackErr;
  }
}

export async function setCachedJson(key: string, value: unknown, ttl = 300) {
  if (!redis) return;
  if (!redis.status || (redis as any).status === "end") {
    return;
  }

  try {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
  } catch (error) {
    console.warn(`[redis] cache write failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteCachedKey(key: string) {
  if (!redis) return;
  if (!redis.status || (redis as any).status === "end") {
    return;
  }

  try {
    await redis.del(key);
  } catch (error) {
    console.warn(`[redis] cache delete failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function disconnectRedis() {
  if (!redis) return;
  try {
    await redis.quit();
    console.log('[redis] disconnected');
  } catch (error) {
    console.warn(`[redis] disconnect failed: ${error instanceof Error ? error.message : String(error)}`);
    try {
      await redis.disconnect();
    } catch (e) {
      // ignore
    }
  }
}
