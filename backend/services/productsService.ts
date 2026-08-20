import { prisma } from "../lib/prisma.js";

const defaults = {
  image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
  logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
};

export const productsService = {
  async listGames() {
    return prisma.game.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        productCards: true,
        sections: { include: { section: true } },
      },
    });
  },

  async getGame(id: number) {
    return prisma.game.findUnique({
      where: { id },
      include: {
        productCards: true,
        sections: { include: { section: true } },
      },
    })
  },

  async listApps() {
    return prisma.app.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        productCards: true,
        sections: { include: { section: true } },
      },
    });
  },

  async getApp(id: number) {
    return prisma.app.findUnique({
      where: { id },
      include: {
        productCards: true,
        sections: { include: { section: true } },
      },
    });
  },

  async listPowerPoints() {
    return prisma.powerpoint.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        productCards: true,
        sections: { include: { section: true } },
      },
    });
  },

  async getPowerPoint(id: number) {
    return prisma.powerpoint.findUnique({
      where: { id },
      include: {
        productCards: true,
        sections: { include: { section: true } },
      },
    });
  },

  async createGame(input: { name: string; description?: string; image?: string; logo?: string; badge?: string }) {
    return prisma.game.create({
      data: {
        name: input.name,
        description: input.description,
        badge: input.badge,
        image: input.image || defaults.image,
        logo: input.logo || defaults.logo,
      },
    });
  },

  async updateGame(id: number, data: any) {
    return prisma.game.update({ where: { id }, data });
  },

  async deleteGame(id: number) {
    await prisma.game.delete({ where: { id } });
  },

  async createApp(input: { name: string; description?: string; image?: string; logo?: string; badge?: string }) {
    return prisma.app.create({
      data: {
        name: input.name,
        description: input.description,
        badge: input.badge,
        image: input.image || defaults.image,
        logo: input.logo || defaults.logo,
      },
    });
  },

  async updateApp(id: number, data: any) {
    return prisma.app.update({ where: { id }, data });
  },

  async deleteApp(id: number) {
    await prisma.app.delete({ where: { id } });
  },

  async createPowerPoint(input: { name: string; description?: string; image?: string; logo?: string; badge?: string }) {
    return prisma.powerpoint.create({
      data: {
        name: input.name,
        description: input.description,
        badge: input.badge,
        image: input.image || defaults.image,
        logo: input.logo || defaults.logo,
      },
    });
  },

  async updatePowerPoint(id: number, data: any) {
    return prisma.powerpoint.update({ where: { id }, data });
  },

  async deletePowerPoint(id: number) {
    await prisma.powerpoint.delete({ where: { id } });
  },
};
