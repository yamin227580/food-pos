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
    // Data validation
    const { name, isRequired = true, menuIds } = req.body;
    const isValid = name && menuIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request.");

    //create new addon category
    const addonCategory = await prisma.addonCategory.create({
      data: { name, isRequired },
    });

    //create new join data
    const newMenuAddonCategory: { menuId: number; addonCategoryId: number }[] =
      menuIds.map((item: number) => ({
        menuId: item,
        addonCategoryId: addonCategory.id,
      }));

    //create new row in menuAddonCategory
    const menuAddonCategories = await prisma.$transaction(
      newMenuAddonCategory.map((item) =>
        prisma.menuAddonCategory.create({
          data: { menuId: item.menuId, addonCategoryId: item.addonCategoryId },
        })
      )
    );
    return res.status(200).json({ addonCategory, menuAddonCategories });
  } else if (method === "PUT") {
    //data validation
    const { id, name, isRequired, menuIds } = req.body;
    const isValid =
      id && name && isRequired !== undefined && menuIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request.");

    //update addonCategory
    const addonCategory = await prisma.addonCategory.update({
      data: { name, isRequired },
      where: { id },
    });

    // delete old row
    await prisma.menuAddonCategory.deleteMany({
      where: { addonCategoryId: id },
    });

    // create new join data
    const menuAddonCategoryData: { addonCategoryId: number; menuId: number }[] =
      menuIds.map((item: number) => ({
        addonCategoryId: id,
        menuId: item,
      }));

    //update menuAddonCategory table
    const menuAddonCategories = await prisma.$transaction(
      menuAddonCategoryData.map((item) =>
        prisma.menuAddonCategory.create({
          data: item,
        })
      )
    );
    return res.status(200).json({ addonCategory, menuAddonCategories });
  } else if (method === "DELETE") {
    const addonCategoryId = Number(req.query.id);

    //find addoncategory to delete
    const addonCategory = await prisma.addonCategory.findFirst({
      where: { id: addonCategoryId },
    });
    if (!addonCategory) return res.status(400).send("Bad request.");
    await prisma.addonCategory.update({
      data: { isArchived: true },
      where: { id: addonCategoryId },
    });
    return res.status(200).send("Deleted.");
  }
  res.status(405).send("Method now allowed.");
}
