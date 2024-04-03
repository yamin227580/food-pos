import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteMenu, updateMenu } from "@/store/slices/menuSlice";
import { UpdateMenuOptions } from "@/types/menu";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuDetail = () => {
  const router = useRouter();
  const menuId = Number(router.query.id);
  const menus = useAppSelector((state) => state.menu.items);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuCategoryMenus = useAppSelector(
    (state) => state.menuCategoryMenu.items
  );
  const currentMenu = menus.find((item) => item.id === menuId);
  const currentMenuCategoryMenus = menuCategoryMenus.filter(
    (item) => item.menuId === menuId
  );
  const menuCategoryIds = currentMenuCategoryMenus.map(
    (item) => item.menuCategoryId
  );
  const [data, setData] = useState<UpdateMenuOptions>();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentMenu) {
      setData({
        id: menuId,
        name: currentMenu.name,
        price: currentMenu.price,
        menuCategoryIds,
      });
    }
  }, [currentMenu]);

  if (!currentMenu || !data) return null;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    setData({ ...data, menuCategoryIds: selectedIds });
  };

  const handleUpdateMenu = () => {
    const isValid = data.name && data.price && data.menuCategoryIds.length > 0;
    if (!isValid) return;
    dispatch(updateMenu(data));
  };

  const handleDeleteMenu = () => {
    dispatch(
      deleteMenu({
        id: menuId,
        onSuccess: () => router.push("/backoffice/menus"),
      })
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
          Delete
        </Button>
      </Box>
      <TextField
        defaultValue={currentMenu.name}
        sx={{ mb: 2 }}
        onChange={(evt) => setData({ ...data, name: evt.target.value })}
      />
      <TextField
        defaultValue={currentMenu.price}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, price: Number(evt.target.value) })
        }
      />
      <FormControl fullWidth>
        <InputLabel>Menu Category</InputLabel>
        <Select
          multiple
          value={data.menuCategoryIds}
          label="Menu Category"
          onChange={handleOnChange}
          renderValue={(selectedMenuCategoryIds) => {
            return selectedMenuCategoryIds
              .map((selectedMenuCategoryId) => {
                return menuCategories.find(
                  (item) => item.id === selectedMenuCategoryId
                ) as MenuCategory;
              })
              .map((item) => <Chip label={item.name} sx={{ mr: 1 }} />);
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
              <Checkbox checked={data.menuCategoryIds.includes(item.id)} />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        sx={{ mt: 2, width: "fit-content" }}
        onClick={handleUpdateMenu}
      >
        Update
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm delete menu</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this menu?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDeleteMenu}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuDetail;
