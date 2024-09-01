import MenuCard from "@/components/MenuCard";
import { useAppSelector } from "@/store/hooks";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { MenuCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const OrderApp = () => {
  const { isReady, ...router } = useRouter();
  const query = router.query;
  const tableId = query.tableId as string;
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuCategoryMenus = useAppSelector(
    (state) => state.menuCategoryMenu.items
  );
  const menus = useAppSelector((state) => state.menu.items);
  const [value, setValue] = useState(0);
  const [selectedMenuCategory, setSelectedMenuCategory] =
    useState<MenuCategory>();

  useEffect(() => {
    if (menuCategories.length) {
      setSelectedMenuCategory(menuCategories[0]);
    }
  }, [menuCategories]);

  useEffect(() => {
    if (isReady && !tableId) {
      router.push("/");
    }
  }, [isReady]);

  const renderMenus = () => {
    const validMenuIds = menuCategoryMenus
      .filter((item) => item.menuCategoryId === selectedMenuCategory?.id)
      .map((item) => item.menuId);
    const validMenus = menus.filter((item) => validMenuIds.includes(item.id));
    return validMenus.map((item) => {
      const href = { pathname: `/order/menus/${item.id}`, query };
      return <MenuCard key={item.id} href={href} menu={item} />;
    });
  };

  return (
    <Box sx={{ position: "relative", px: 2, top: { sm: 240 } }}>
      <Box sx={{ position: "fixed", top: { xs: 60, sm: 220 }, zIndex: 10 }}>
        <Tabs
          TabIndicatorProps={{
            style: { background: "#1B9C85" },
          }}
          value={value}
          onChange={(evt, value) => setValue(value)}
          variant="scrollable"
          sx={{
            ".Mui-selected": {
              color: "#1B9C85",
              fontWeight: "bold",
            },
          }}
        >
          {menuCategories.map((item) => {
            return (
              <Tab
                key={item.id}
                label={item.name}
                sx={{ color: "#4C4C6D" }}
                onClick={() => setSelectedMenuCategory(item)}
              />
            );
          })}
        </Tabs>
      </Box>
      <Box
        sx={{
          display: "flex",
          pt: { xs: 15, sm: 6 },

          flexWrap: "wrap",

          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {renderMenus()}
      </Box>
    </Box>
  );
};

export default OrderApp;
