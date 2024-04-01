import ItemCard from "@/components/ItemCard";
import NewMenu from "@/components/NewMenu";
import { useAppSelector } from "@/store/hooks";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const MenusPage = () => {
  const [open, setOpen] = useState(false);
  const menus = useAppSelector((state) => state.menu.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New menu
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {menus.map((item) => (
          <ItemCard
            href={`/backoffice/menus/${item.id}`}
            key={item.id}
            title={item.name}
            icon={<LocalDiningIcon />}
          />
        ))}
      </Box>
      <NewMenu open={open} setOpen={setOpen} />
    </Box>
  );
};
export default MenusPage;
