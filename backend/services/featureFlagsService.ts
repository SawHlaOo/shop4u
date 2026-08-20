import { prisma } from "../lib/prisma.js";

export const featureFlagsService = {
  async listFlags() {
    return prisma.featureFlag.findMany({ orderBy: { createdAt: "desc" } });
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

    return flag;
  },

  async updateFlag(key: string, input: { key?: string; enabled?: boolean; description?: string }) {
    const flag = await prisma.featureFlag.update({
      where: { key },
      data: input,
    });

    return flag;
  },

  async deleteFlag(key: string) {
    await prisma.featureFlag.delete({ where: { key } });
  },
};
