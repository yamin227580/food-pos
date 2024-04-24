import ItemCard from "@/components/ItemCard";
import NewMenuCategory from "@/components/NewMenuCatetory";
import { useAppSelector } from "@/store/hooks";
import CategoryIcon from "@mui/icons-material/Category";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const MenuCategoriesPage = () => {
  const [open, setOpen] = useState(false);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const disalbedLocationmenuCategories = useAppSelector(
    (state) => state.disableLocationMenuCategory.items
  );
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New menu category
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {menuCategories.map((item) => {
          const exist = disalbedLocationmenuCategories?.find(
            (disalbedLocationmenuCategory) =>
              disalbedLocationmenuCategory.locationId ===
                Number(localStorage.getItem("selectedLocationId")) &&
              disalbedLocationmenuCategory.menuCategoryId === item.id
          );
          const isAvailable = exist ? false : true;
          console.log(exist);
          return (
            <ItemCard
              icon={<CategoryIcon />}
              href={`/backoffice/menu-categories/${item.id}`}
              key={item.id}
              title={item.name}
              isAvailable={isAvailable}
            />
          );
        })}
      </Box>
      <NewMenuCategory open={open} setOpen={setOpen} />
    </Box>
  );
};
export default MenuCategoriesPage;
