import { Worker } from "bullmq";
import "dotenv/config";

const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
};

new Worker(
  "digitalshop-jobs",
  async (job) => {
    console.log(`[worker] processing ${job.name}`, job.data);

    if (job.name === "sendWelcomeEmail") {
      const { email, name, userId } = job.data as { email?: string; name?: string; userId?: number };
      // Placeholder: integrate with real email provider (e.g., SendGrid, SES, nodemailer)
      // For now we simulate sending and log. In production replace with actual send logic and retries.
      console.log(`[worker] sendWelcomeEmail -> to=${email} userId=${userId} name=${name}`);

      // Simulate success
      return { ok: true, sentTo: email };
    }

    // Default handler for other job types
    return { ok: true };
  },
  { connection }
);
