import { prisma } from "../lib/prisma";
import { deleteCachedKey, getCachedJson } from "../lib/redis";

const cacheKey = "feature-flags:all";

export const featureFlagsService = {
  async listFlags() {
    return getCachedJson(cacheKey, async () => {
      return prisma.featureFlag.findMany({ orderBy: { createdAt: "desc" } });
    }, 120);
  },

  async getFlag(key: string) {
    return prisma.featureFlag.findUnique({ where: { key } });
  },

  async createFlag(input: { key: string; enabled?: boolean; description?: string }) {
    const flag = await prisma.featureFlag.create({
      data: {
        ...input,
        enabled: input.enabled ?? false,
      },
    });

    await deleteCachedKey(cacheKey);
    return flag;
  },

  async updateFlag(key: string, input: { key?: string; enabled?: boolean; description?: string }) {
    const flag = await prisma.featureFlag.update({
      where: { key },
      data: input,
    });

    await deleteCachedKey(cacheKey);
    return flag;
  },

  async deleteFlag(key: string) {
    await prisma.featureFlag.delete({ where: { key } });
    await deleteCachedKey(cacheKey);
  },
};
