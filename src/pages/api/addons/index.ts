import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthorized");
  const method = req.method;
  if (method === "POST") {
    const { name, price, addonCategoryId } = req.body;
    const isValid = name && price !== undefined && addonCategoryId;
    if (!isValid) return res.status(400).send("Bad request.");
    const addon = await prisma.addon.create({
      data: { name, price, addonCategoryId },
    });
    return res.status(200).json({ addon });
  } else if (method === "PUT") {
    const { id, name, price, addonCategoryId } = req.body;
    const isValid = id && name && price !== undefined && addonCategoryId;
    if (!isValid) return res.status(400).send("Bad request.");
    const exist = await prisma.addon.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request.");
    const addon = await prisma.addon.update({
      data: { name, price, addonCategoryId },
      where: { id },
    });
    return res.status(200).json({ addon });
  } else if (method === "DELETE") {
    const addonId = Number(req.query.id);
    const addon = await prisma.addon.findFirst({
      where: { id: addonId },
    });
    if (!addon) return res.status(400).send("Bad request.");
    await prisma.addon.update({
      data: { isArchived: true },
      where: { id: addonId },
    });
    return res.status(200).send("Deleted.");
  }
  res.status(405).send("Method now allowed.");
}
