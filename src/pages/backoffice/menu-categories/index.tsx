import NewMenuCategory from "@/components/NewMenuCatetory";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const MenuCategoriesPage = () => {
  const [open, setOpen] = useState(false);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New menu category
        </Button>
      </Box>
      {menuCategories.map((item) => (
        <Typography>{item.name}</Typography>
      ))}
      <NewMenuCategory open={open} setOpen={setOpen} />
    </Box>
  );
};
export default MenuCategoriesPage;
