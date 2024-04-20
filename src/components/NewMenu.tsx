import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createMenu, setLoadingMenu } from "@/store/slices/menuSlice";
import { CreateMenuOptions } from "@/types/menu";
import { config } from "@/utils/config";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { MenuCategory } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import FileDropZone from "./FileDropZone";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

// 1. default value for new menu
const defaultNewMenu = {
  name: "",
  price: 0,
  menuCategoryIds: [],
};

const NewMenu = ({ open, setOpen }: Props) => {
  // 2 . new menu state
  const [newMenu, setNewMenu] = useState<CreateMenuOptions>(defaultNewMenu);

  const [menuImage, setMenuImage] = useState<File>();

  // 3. get all menu-category from store
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const { isLoading } = useAppSelector((state) => state.menu);
  const dispatch = useAppDispatch();

  const onFileSelected = (files: File[]) => {
    setMenuImage(files[0]);
  };

  // 4. Selected menu-category function
  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    //select internally logic works adding evt value into menuCategoryIds array and remove it
    //don't need to push and remvove in menuCategoryId array
    const selectedIds = evt.target.value as number[];
    setNewMenu({ ...newMenu, menuCategoryIds: selectedIds });
  };

  // 5. create menu
  const handleCreateMenu = async () => {
    dispatch(setLoadingMenu(true));
    const newMenuPayload = { ...newMenu };
    if (menuImage) {
      const formData = new FormData();
      formData.append("files", menuImage);
      const response = await fetch(`${config.apiBaseUrl}/assets`, {
        method: "POST",
        body: formData,
      });
      const { assetUrl } = await response.json();
      newMenuPayload.assetUrl = assetUrl;
    }
    dispatch(
      createMenu({
        ...newMenuPayload,
        onSuccess: () => {
          setOpen(false);
          dispatch(setLoadingMenu(false));
        },
      })
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setNewMenu(defaultNewMenu);
        setOpen(false);
      }}
    >
      <DialogTitle>Create new menu</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", width: 400 }}
      >
        <TextField
          placeholder="Name"
          sx={{ mb: 2 }}
          onChange={(evt) => setNewMenu({ ...newMenu, name: evt.target.value })}
        />
        <TextField
          placeholder="Price"
          sx={{ mb: 2 }}
          onChange={(evt) =>
            setNewMenu({ ...newMenu, price: Number(evt.target.value) })
          }
        />

        <FormControl fullWidth>
          <InputLabel>Menu Category</InputLabel>
          <Select
            multiple
            value={newMenu.menuCategoryIds}
            label="Menu Category"
            onChange={handleOnChange}
            //selectedMenuCategoryIds means the current selected value in value={newMenu.menuCategoryIds}
            renderValue={(selectedMenuCategoryIds) => {
              return selectedMenuCategoryIds
                .map((selectedMenuCategoryId) => {
                  return menuCategories.find(
                    (item) => item.id === selectedMenuCategoryId
                  ) as MenuCategory;
                })
                .map((item) => item.name)
                .join(", ");
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
            {menuCategories.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <Checkbox checked={newMenu.menuCategoryIds.includes(item.id)} />
                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <FileDropZone onFileSelected={onFileSelected} />
          {menuImage && (
            <Chip
              sx={{ mt: 2 }}
              label={menuImage.name}
              onDelete={() => setMenuImage(undefined)}
            />
          )}
        </Box>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            disabled={!newMenu.name || !newMenu.menuCategoryIds.length}
            onClick={handleCreateMenu}
          >
            Confirm
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewMenu;
