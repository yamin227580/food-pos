import NewLocation from "@/components/NewLocation";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const LocationPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New location
        </Button>
      </Box>
      <h1>Other stuffs here ...</h1>
      <NewLocation open={open} setOpen={setOpen} />
    </Box>
  );
};
export default LocationPage;
