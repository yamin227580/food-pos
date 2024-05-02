import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeAddonCategory } from "@/store/slices/addonCategorySlice";
import { removeMenuAddonCategoryById } from "@/store/slices/menuAddonCategorySlice";
import { deleteMenu, updateMenu } from "@/store/slices/menuSlice";
import { UpdateMenuOptions } from "@/types/menu";
import { config } from "@/utils/config";
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
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from "@mui/material";
import { MenuCategory } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

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

  const menuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );

  const disabledLocationMenus = useAppSelector(
    (state) => state.disableLocationMenu.items
  );
  const [data, setData] = useState<UpdateMenuOptions>();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentMenu) {
      const selectedLocationId = Number(
        localStorage.getItem("selectedLocationId")
      );
      const disalbedLocationMenu = disabledLocationMenus.find(
        (item) =>
          item.locationId === selectedLocationId && item.menuId === menuId
      );
      setData({
        id: menuId,
        name: currentMenu.name,
        price: currentMenu.price,
        menuCategoryIds,
        locationId: selectedLocationId,
        isAvailable: disalbedLocationMenu ? false : true,
      });
    }
  }, [currentMenu, disabledLocationMenus]);

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

  const handleMenuImageUpdate = async (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    if (files) {
      const file = files[0];
      const formData = new FormData();
      formData.append("files", file);
      const response = await fetch(`${config.apiBaseUrl}/assets`, {
        method: "POST",
        body: formData,
      });
      const { assetUrl } = await response.json();
      dispatch(updateMenu({ ...data, assetUrl }));
    }
  };

  const handleDeleteMenu = () => {
    dispatch(
      deleteMenu({
        id: menuId,
        onSuccess: () => {
          menuAddonCategories
            .filter((item) => item.menuId === menuId)
            .map((item) => item.addonCategoryId)
            .forEach((addonCategoryId) => {
              const entries = menuAddonCategories.filter(
                (item) => item.addonCategoryId === addonCategoryId
              );
              if (entries.length === 1) {
                const menuAddonCategoryId = entries[0].id;
                dispatch(removeAddonCategory({ id: addonCategoryId }));
                dispatch(
                  removeMenuAddonCategoryById({ id: menuAddonCategoryId })
                );
              }
            });
          router.push("/backoffice/menus");
        },
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Image
          src={currentMenu.assetUrl || "/default-menu.png"}
          alt="menu-image"
          width={150}
          height={150}
          style={{ borderRadius: 8 }}
        />
        <Button
          variant="outlined"
          component="label"
          sx={{ width: "fit-content", mt: 2 }}
        >
          Upload File
          <input type="file" hidden onChange={handleMenuImageUpdate} />
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
          {menuCategories.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={data.menuCategoryIds.includes(item.id)} />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            defaultChecked={data.isAvailable}
            onChange={(evt, value) => setData({ ...data, isAvailable: value })}
          />
        }
        label="Available"
      />
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
