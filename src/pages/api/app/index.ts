// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("unauthorized user");
  const name = session.user?.name as string;
  const email = session.user?.email as string;
  const dbUser = await prisma.user.findFirst({ where: { email } });
  if (!dbUser) {
    const newUser = await prisma.user.create({ data: { name, email } });
    return res.status(200).json(newUser);
  }
  res.status(200).send("exit user");
}
