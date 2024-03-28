import NewTable from "@/components/NewTable";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const TablePage = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New table
        </Button>
      </Box>
      <h1>Other stuffs here ...</h1>
      <NewTable open={open} setOpen={setOpen} />
    </Box>
  );
};
export default TablePage;
