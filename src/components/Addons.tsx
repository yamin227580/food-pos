import { useAppSelector } from "@/store/hooks";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { Addon } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface Props {
  addonCategoryId: number;
  selectedAddons: Addon[];
  setSelectedAddons: Dispatch<SetStateAction<Addon[]>>;
}

const Addons = ({
  addonCategoryId,
  selectedAddons,
  setSelectedAddons,
}: Props) => {
  const addonCategory = useAppSelector(
    (state) => state.addonCategory.items
  ).find((item) => item.id === addonCategoryId);
  const addons = useAppSelector((state) => state.addon.items).filter(
    (item) => item.addonCategoryId === addonCategoryId
  );
  if (!addonCategory) return null;
  return (
    <Box>
      {addons.map((addon) => {
        return (
          <Box
            key={addon.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                addonCategory.isRequired ? (
                  <Radio
                    color="success"
                    checked={
                      selectedAddons.find((item) => item.id === addon.id)
                        ? true
                        : false
                    }
                    onChange={() => {
                      const addonIds = addons.map((item) => item.id);
                      const others = selectedAddons.filter(
                        (item) => !addonIds.includes(item.id)
                      );
                      setSelectedAddons([...others, addon]);
                    }}
                  />
                ) : (
                  <Checkbox
                    color="success"
                    checked={
                      selectedAddons.find((item) => item.id === addon.id)
                        ? true
                        : false
                    }
                    onChange={(evt, value) => {
                      //value is true or false depands on addon is selected or not in check box
                      if (value) {
                        setSelectedAddons([...selectedAddons, addon]);
                      } else {
                        const selected = selectedAddons.filter(
                          (selectedAddon) => selectedAddon !== addon
                        );
                        setSelectedAddons(selected);
                      }
                    }}
                  />
                )
              }
              label={addon.name}
            />
            <Typography sx={{ fontStyle: "italic" }}>{addon.price}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default Addons;
