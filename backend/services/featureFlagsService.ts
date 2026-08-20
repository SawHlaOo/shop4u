import { prisma } from "../lib/prisma.js";

const builtInFlags = ["promotions", "popular", "new_arrivals"];

export const featureFlagsService = {
  async listFlags() {
    await Promise.all(builtInFlags.map((key) => prisma.featureFlag.upsert({
      where: { key },
      update: {},
      create: { key, enabled: true },
    })));
    return prisma.featureFlag.findMany({ orderBy: { createdAt: "desc" } });
  },

  async getFlag(key: string) {
    if (builtInFlags.includes(key)) {
      return prisma.featureFlag.upsert({
        where: { key },
        update: {},
        create: { key, enabled: true },
      });
    }
    return prisma.featureFlag.findUnique({ where: { key } });
  },

  async createFlag(input: { key: string; enabled?: boolean; description?: string }) {
    const { key, enabled } = input;
    const flag = await prisma.featureFlag.create({
      data: {
        key,
        enabled: enabled ?? false,
      },
    });

    return flag;
  },

  async updateFlag(key: string, input: { key?: string; enabled?: boolean; description?: string }) {
    const data = input.enabled === undefined ? {} : { enabled: input.enabled };
    const flag = await prisma.featureFlag.update({
      where: { key },
      data,
    });

    return flag;
  },

  async deleteFlag(key: string) {
    await prisma.featureFlag.delete({ where: { key } });
  },
};
