import { useAppDispatch } from "@/store/hooks";
import { createTable } from "@/store/slices/tableSlice";
import { CreateTableOptions } from "@/types/table";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultNewTable = {
  name: "",
  locationId: undefined,
};

const NewTable = ({ open, setOpen }: Props) => {
  const [newTable, setNewTable] = useState<CreateTableOptions>(defaultNewTable);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setNewTable({
      ...newTable,
      locationId: Number(localStorage.getItem("selectedLocationId")),
    });
  }, []);

  const handleCreateMenu = () => {
    dispatch(createTable({ ...newTable, onSuccess: () => setOpen(false) }));
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setNewTable(defaultNewTable);
      }}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "400px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>Create new table</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          placeholder="Name"
          sx={{ mb: 2 }}
          onChange={(evt) =>
            setNewTable({ ...newTable, name: evt.target.value })
          }
        />
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!newTable.name}
            onClick={handleCreateMenu}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewTable;
