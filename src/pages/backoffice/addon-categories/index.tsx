import NewAddonCategory from "@/components/NewAddonCategory";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const AddonCategoriesPage = () => {
  const [open, setOpen] = useState(false);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New addon category
        </Button>
      </Box>
      {addonCategories.map((item) => (
        <Typography>{item.name}</Typography>
      ))}
      <NewAddonCategory open={open} setOpen={setOpen} />
    </Box>
  );
};
export default AddonCategoriesPage;
