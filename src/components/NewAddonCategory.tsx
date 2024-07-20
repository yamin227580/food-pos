import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAddonCategory } from "@/store/slices/addonCategorySlice";
import { setOpenSnackbar } from "@/store/slices/snackbarSlice";

import { CreateAddonCategoryOptions } from "@/types/addonCategory";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Menu } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const defaultNewAddonCategory = {
  name: "",
  isRequired: true,
  menuIds: [],
};
const NewAddonCategory = ({ open, setOpen }: Props) => {
  const [newAddonCategory, setNewAddonCategory] =
    useState<CreateAddonCategoryOptions>(defaultNewAddonCategory);
  const menus = useAppSelector((state) => state.menu.items);
  const dispatch = useAppDispatch();

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    setNewAddonCategory({ ...newAddonCategory, menuIds: selectedIds });
  };

  const handleCreateAddonCategory = () => {
    const isValid =
      newAddonCategory.name && newAddonCategory.menuIds.length > 0;
    if (!isValid) {
      return dispatch(
        setOpenSnackbar({
          message: "Missing required fields",
          severity: "error",
        })
      );
    }
    dispatch(
      createAddonCategory({
        ...newAddonCategory,
        onSuccess: () => {
          setOpen(false);
          dispatch(
            setOpenSnackbar({
              message: "New addon category created succcessfully.",
              severity: "success",
              open: true,
              autoHideDuration: 3000,
            })
          );
        },
      })
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setNewAddonCategory(defaultNewAddonCategory);
        setOpen(false);
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
      <DialogTitle>Create new addon category</DialogTitle>
      <DialogContent>
        <TextField
          onChange={(evt) =>
            setNewAddonCategory({ ...newAddonCategory, name: evt.target.value })
          }
          sx={{ mb: 2, width: "100%" }}
        />
        <FormControl fullWidth>
          <InputLabel>Menus</InputLabel>
          <Select
            multiple
            value={newAddonCategory.menuIds}
            label="Menus"
            onChange={handleOnChange}
            renderValue={(selectedMenuIds) => {
              return selectedMenuIds
                .map((selectedMenuId) => {
                  return menus.find(
                    (item) => item.id === selectedMenuId
                  ) as Menu;
                })
                .map((item) => (
                  <Chip key={item.id} label={item.name} sx={{ mr: 1 }} />
                ));
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {menus.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <Checkbox
                  checked={newAddonCategory.menuIds.includes(item.id)}
                />
                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={newAddonCategory.isRequired}
              onChange={(evt, value) =>
                setNewAddonCategory({
                  ...newAddonCategory,
                  isRequired: value,
                })
              }
            />
          }
          label="Required"
          sx={{ mt: 1 }}
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
            disabled={
              !newAddonCategory.name || !newAddonCategory.menuIds.length
            }
            onClick={handleCreateAddonCategory}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default NewAddonCategory;
