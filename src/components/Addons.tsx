import { useAppSelector } from "@/store/hooks";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
  addonCategoryId: number;
  selectedAddonIds: number[];
  setSelectedAddonIds: Dispatch<SetStateAction<number[]>>;
}

const Addons = ({
  addonCategoryId,
  selectedAddonIds,
  setSelectedAddonIds,
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
                      selectedAddonIds.find((addonId) => addonId === addon.id)
                        ? true
                        : false
                    }
                    onChange={() => {
                      const addonIds = addons.map((item) => item.id);
                      const others = selectedAddonIds.filter(
                        (item) => !addonIds.includes(item)
                      );
                      setSelectedAddonIds([...others, addon.id]);
                    }}
                  />
                ) : (
                  <Checkbox
                    color="success"
                    checked={
                      selectedAddonIds.find((addonId) => addonId === addon.id)
                        ? true
                        : false
                    }
                    onChange={(evt, value) => {
                      //value is true or false depands on addon is selected or not con in check box
                      if (value) {
                        setSelectedAddonIds([...selectedAddonIds, addon.id]);
                      } else {
                        const selected = selectedAddonIds.filter(
                          (selectedAddonId) => selectedAddonId !== addon.id
                        );
                        setSelectedAddonIds(selected);
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
