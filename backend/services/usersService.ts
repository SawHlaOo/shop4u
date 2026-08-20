import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const sanitizeUser = (user: Record<string, unknown>) => {
  const { password, ...rest } = user;
  return rest;
};

export const usersService = {
  async verify(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return null;
    }

    return sanitizeUser(user as Record<string, unknown>);
  },

  async login(input: { username: string; password: string }) {
    const user = await prisma.user.findFirst({ where: { username: input.username } });

    if (user && (await bcrypt.compare(input.password, user.password))) {
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
      return {
        user: sanitizeUser(user as Record<string, unknown>),
        token,
      };
    }

    return null;
  },

  async register(input: {
    name: string;
    username: string;
    email: string;
    password: string;
    bio?: string;
    role: "USER" | "ADMIN";
  }) {
    const existing = await prisma.user.findFirst({ where: { OR: [{ username: input.username }, { email: input.email }] } });
    if (existing) {
      return null;
    }

    const user = await prisma.user.create({
      data: {
        name: input.name,
        username: input.username,
        email: input.email,
        bio: input.bio,
        role: input.role,
        password: await bcrypt.hash(input.password, 10),
      },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    return {
      user: sanitizeUser(user as Record<string, unknown>),
      token,
    };
  },

  async deleteUser(id: number) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return false;
    }

    await prisma.user.delete({ where: { id } });
    return true;
  },
};
