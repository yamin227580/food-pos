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
    const { name, price, assetUrl, menuCategoryIds } = req.body;
    const isValid = name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request.");
    const menu = await prisma.menu.create({ data: { name, price, assetUrl } });
    const newMenuCategoryMenu: { menuCategoryId: number; menuId: number }[] =
      menuCategoryIds.map((item: number) => ({
        menuCategoryId: item,
        menuId: menu.id,
      }));
    const menuCategoryMenus = await prisma.$transaction(
      newMenuCategoryMenu.map((item) =>
        prisma.menuCategoryMenu.create({
          data: { menuCategoryId: item.menuCategoryId, menuId: item.menuId },
        })
      )
    );
    return res.status(200).json({ menu, menuCategoryMenus });
  } else if (method === "PUT") {
    //get data from request
    const { id, name, price, menuCategoryIds, locationId, isAvailable } =
      req.body;

    //data validation
    const isValid =
      id && name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request.");

    //update menu
    const menu = await prisma.menu.update({
      data: { name, price },
      where: { id },
    });

    // create updated data
    const menuCategoryMenusData: { menuId: number; menuCategoryId: number }[] =
      menuCategoryIds.map((item: number) => ({
        menuId: id,
        menuCategoryId: item,
      }));

    // delete old  menuCategoryMenu rows
    await prisma.menuCategoryMenu.deleteMany({ where: { menuId: id } });

    //update menuCategoryMenu with updated data
    const menuCategoryMenus = await prisma.$transaction(
      menuCategoryMenusData.map((item) =>
        prisma.menuCategoryMenu.create({
          data: item,
        })
      )
    );

    if (locationId) {
      if (isAvailable === false) {
        const exist = await prisma.disabledLocationMenu.findFirst({
          where: { menuId: id },
        });
        if (!exist) {
          await prisma.disabledLocationMenu.create({
            data: { locationId, menuId: id },
          });
        }
      } else {
        await prisma.disabledLocationMenu.deleteMany({
          where: { locationId, menuId: id },
        });
      }
    }
    const disabledLocationMenus = await prisma.disabledLocationMenu.findMany({
      where: { menuId: id },
    });

    //return updated menu and menuCategoryMenus
    return res
      .status(200)
      .json({ menu, menuCategoryMenus, disabledLocationMenus });
  } else if (method === "DELETE") {
    const menuId = Number(req.query.id);
    const menu = await prisma.menu.findFirst({ where: { id: menuId } });
    if (!menu) return res.status(400).send("Bad request.");
    await prisma.menuAddonCategory.updateMany({
      data: { isArchived: true },
      where: { menuId },
    });
    const menuAddonCategoriesRow = await prisma.menuAddonCategory.findMany({
      where: { menuId },
    });
    const addonCategoryIds = menuAddonCategoriesRow.map(
      (item) => item.addonCategoryId
    );

    //check whether addonCategoryId is connected to only one menu or many menu
    //do some logic depends on upper condition

    await prisma.menu.update({
      data: { isArchived: true },
      where: { id: menuId },
    });
    return res.status(200).send("Deleted.");
  }
  res.status(405).send("Method not allowed.");
}
