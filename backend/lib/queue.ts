import { Queue } from "bullmq";
import "dotenv/config";

const connection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
    };

export const appQueue = new Queue("digitalshop-jobs", { connection });
