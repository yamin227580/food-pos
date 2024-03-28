import NewAddonCategory from "@/components/NewAddonCategory";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const AddonCategoriesPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New addon category
        </Button>
      </Box>
      <h1>Other stuffs here ...</h1>
      <NewAddonCategory open={open} setOpen={setOpen} />
    </Box>
  );
};
export default AddonCategoriesPage;
