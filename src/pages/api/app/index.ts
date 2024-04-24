// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import { getQrCodeUrl, qrCodeImageUpload } from "@/utils/fileUpload";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const { tableId } = req.query;
  const isOrderAppRequest = tableId;

  if (method === "GET") {
    if (isOrderAppRequest) {
      const table = await prisma.table.findFirst({
        where: { id: Number(tableId) },
      });
      const location = await prisma.location.findFirst({
        where: { id: table?.locationId },
      });
      const companyId = location?.companyId;
      let menuCategories = await prisma.menuCategory.findMany({
        where: { companyId: Number(companyId), isArchived: false },
      });
      const menuCategoryIds = menuCategories.map((item) => item.id);
      const disabledMenuCategoryIds = (
        await prisma.disabledLocationMenuCategory.findMany({
          where: {
            menuCategoryId: { in: menuCategoryIds },
            locationId: location?.id,
          },
        })
      ).map((item) => item.menuCategoryId);

      menuCategories = menuCategories.filter(
        (item) => !disabledMenuCategoryIds.includes(item.id)
      );

      const menuCategoryMenus = await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId: { in: menuCategoryIds }, isArchived: false },
      });
      const menuIds = menuCategoryMenus.map((item) => item.menuId);
      const disabledMenuIds = (
        await prisma.disabledLocationMenu.findMany({
          where: { menuId: { in: menuIds }, locationId: location?.id },
        })
      ).map((item) => item.menuId);
      const menus = (
        await prisma.menu.findMany({
          where: { id: { in: menuIds }, isArchived: false },
        })
      ).filter((item) => !disabledMenuIds.includes(item.id));
      const menuAddonCategories = await prisma.menuAddonCategory.findMany({
        where: { menuId: { in: menuIds }, isArchived: false },
      });
      const addonCategoryIds = menuAddonCategories.map(
        (item) => item.addonCategoryId
      );
      const addonCategories = await prisma.addonCategory.findMany({
        where: { id: { in: addonCategoryIds }, isArchived: false },
      });
      const addons = await prisma.addon.findMany({
        where: {
          addonCategoryId: { in: addonCategoryIds },
          isArchived: false,
        },
      });
      const tableIds = (
        await prisma.table.findMany({ where: { locationId: location?.id } })
      ).map((item) => item.id);
      const orders = await prisma.order.findMany({
        where: { tableId: { in: tableIds } },
      });
      return res.status(200).json({
        locations: [],
        menuCategories,
        menus,
        menuCategoryMenus,
        menuAddonCategories,
        addonCategories,
        addons,
        tables: [],
        disabledLocationMenuCategories: [],
        disabledLocationMenus: [],
        orders,
      });
    } else {
      const session = await getServerSession(req, res, authOptions);
      if (!session) return res.status(401).send("unauthorized user");
      const name = session.user?.name as string;
      const email = session.user?.email as string;
      const dbUser = await prisma.user.findFirst({ where: { email } });
      if (!dbUser) {
        // 1. create new company for user and assign user to it.
        const newCompanyName = "Ah Wa Sarr";
        const newCompanyAddress = "Hintada Street 21, Sanchaung, Yangon";
        const company = await prisma.company.create({
          data: { name: newCompanyName, address: newCompanyAddress },
        });

        // 2. create new user
        await prisma.user.create({
          data: { name, email, companyId: company.id },
        });

        // 3. create new menu category
        const newMenuCategoryName = "Default menu category";
        const menuCategory = await prisma.menuCategory.create({
          data: { name: newMenuCategoryName, companyId: company.id },
        });

        // 4. create new menu
        const newMenuName = "Default menu";
        const menu = await prisma.menu.create({
          data: { name: newMenuName, price: 1000 },
        });

        // 5. create new row in MenuCategoryMenu
        const menuCategoryMenu = await prisma.menuCategoryMenu.create({
          data: { menuCategoryId: menuCategory.id, menuId: menu.id },
        });

        // 6. create new addon category
        const newAddonCategoryName = "Default addon category";
        const addonCategory = await prisma.addonCategory.create({
          data: { name: newAddonCategoryName },
        });

        // 7. create new row in MenuAddonCategory
        const menuAddonCategory = await prisma.menuAddonCategory.create({
          data: { menuId: menu.id, addonCategoryId: addonCategory.id },
        });

        // 8. create new addon
        const newAddonNameOne = "Default addon 1";
        const newAddonNameTwo = "Default addon 2";
        const newAddonNameThree = "Default addon 3";
        const newAddonsData = [
          { name: newAddonNameOne, addonCategoryId: addonCategory.id },
          { name: newAddonNameTwo, addonCategoryId: addonCategory.id },
          { name: newAddonNameThree, addonCategoryId: addonCategory.id },
        ];
        const addons = await prisma.$transaction(
          newAddonsData.map((addon) => prisma.addon.create({ data: addon }))
        );

        // 9. create new location
        const newLocationName = "Sanchaung";
        const location = await prisma.location.create({
          data: {
            name: newLocationName,
            address: newCompanyAddress,
            companyId: company.id,
          },
        });

        // 10. create new table
        const newTableName = "Default table";
        let table = await prisma.table.create({
          data: { name: newTableName, locationId: location.id, assetUrl: "" },
        });
        await qrCodeImageUpload(table.id);
        const assetUrl = getQrCodeUrl(table.id);
        table = await prisma.table.update({
          data: { assetUrl },
          where: { id: table.id },
        });

        return res.status(200).json({
          menuCategories: [menuCategory],
          menus: [menu],
          menuCategoryMenus: [menuCategoryMenu],
          addonCategories: [addonCategory],
          menuAddonCategories: [menuAddonCategory],
          addons,
          locations: [location],
          tables: [table],
          orders: [],
        });
      } else {
        // 1. get company id from current user
        const companyId = dbUser.companyId;

        // 3.find locations
        const locations = await prisma.location.findMany({
          where: { companyId, isArchived: false },
        });
        const locationIds = locations.map((item) => item.id);

        // 3. find menucategories
        const menuCategories = await prisma.menuCategory.findMany({
          where: { companyId, isArchived: false },
        });
        const menuCategoryIds = menuCategories.map((item) => item.id);

        // 4. find menu
        const menuCategoryMenus = await prisma.menuCategoryMenu.findMany({
          where: { menuCategoryId: { in: menuCategoryIds }, isArchived: false },
        });
        const menuIds = menuCategoryMenus.map((item) => item.menuId);
        const menus = await prisma.menu.findMany({
          where: { id: { in: menuIds }, isArchived: false },
        });

        const disabledLocationMenus =
          await prisma.disabledLocationMenu.findMany({
            where: { menuId: { in: menuIds }, isArchived: false },
          });

        // 5. find addon category
        const menuAddonCategories = await prisma.menuAddonCategory.findMany({
          where: { menuId: { in: menuIds }, isArchived: false },
        });
        const addonCategoryIds = menuAddonCategories.map(
          (item) => item.addonCategoryId
        );
        const addonCategories = await prisma.addonCategory.findMany({
          where: { id: { in: addonCategoryIds }, isArchived: false },
        });

        // 6. find addons
        const addons = await prisma.addon.findMany({
          where: {
            addonCategoryId: { in: addonCategoryIds },
            isArchived: false,
          },
        });

        // 7. find table
        const tables = await prisma.table.findMany({
          where: { locationId: { in: locationIds }, isArchived: false },
        });

        const orders = await prisma.order.findMany({
          where: { tableId: { in: tables.map((item) => item.id) } },
        });

        const disabledLocationMenuCategories =
          await prisma.disabledLocationMenuCategory.findMany({
            where: {
              menuCategoryId: { in: menuCategoryIds },
              isArchived: false,
            },
          });

        // 8. response all founded data
        return res.status(200).json({
          locations,
          menuCategories,
          menus,
          menuCategoryMenus,
          menuAddonCategories,
          addonCategories,
          addons,
          tables,
          disabledLocationMenuCategories,
          disabledLocationMenus,
          orders,
        });
      }
    }
  }
  res.status(405).send("Method not allowed.");
}
