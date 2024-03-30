import NewLocation from "@/components/NewLocation";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const LocationPage = () => {
  const [open, setOpen] = useState(false);
  const locations = useAppSelector((state) => state.location.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New location
        </Button>
      </Box>
      {locations.map((item) => (
        <Typography>{item.name}</Typography>
      ))}
      <NewLocation open={open} setOpen={setOpen} />
    </Box>
  );
};
export default LocationPage;
