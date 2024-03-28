import NewAddon from "@/components/NewAddon";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const AddonPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New addon
        </Button>
      </Box>
      <h1>Other stuffs here ...</h1>
      <NewAddon open={open} setOpen={setOpen} />
    </Box>
  );
};
export default AddonPage;
