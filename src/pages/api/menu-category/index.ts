import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. check user login
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthorized");

  const method = req.method;

  if (method === "POST") {
    // 2. Data validation
    const { name, locationId } = req.body;
    const isValid = name && locationId;
    if (!isValid) return res.status(400).send("Bad request.");

    // 3. get current location
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
    if (!location) return res.status(400).send("Bad request.");

    // 4. create new menu category
    const menuCategory = await prisma.menuCategory.create({
      data: { name, companyId: location.companyId },
    });

    // 5. response
    return res.status(200).json(menuCategory);
  }
  res.status(405).send("Method now allowed.");
}
