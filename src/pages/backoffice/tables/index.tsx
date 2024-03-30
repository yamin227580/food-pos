import NewTable from "@/components/NewTable";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const TablePage = () => {
  const [open, setOpen] = useState(false);
  const tables = useAppSelector((state) => state.table.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New table
        </Button>
      </Box>
      {tables.map((item) => (
        <Typography>{item.name}</Typography>
      ))}
      <NewTable open={open} setOpen={setOpen} />
    </Box>
  );
};
export default TablePage;
