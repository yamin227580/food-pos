import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedLocation } from "@/store/slices/locationSlice";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const locations = useAppSelector((state) => state.location.items);
  const [locationId, setLocationId] = useState<number>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (locations.length) {
      const selectedLocationId = localStorage.getItem("selectedLocationId");
      if (selectedLocationId) {
        setLocationId(Number(selectedLocationId));
        const locaton = locations.find(
          (item) => item.id === Number(selectedLocationId)
        );
        if (locaton) {
          dispatch(setSelectedLocation(locaton));
        }
      } else {
        const firstLocationId = locations[0].id;
        setLocationId(Number(firstLocationId));
        localStorage.setItem("selectedLocationId", String(firstLocationId));
        dispatch(setSelectedLocation(locations[0]));
      }
    }
  }, [locations, locationId]);

  const handleLocationChange = (evt: SelectChangeEvent<number>) => {
    localStorage.setItem("selectedLocationId", String(evt.target.value));
    setLocationId(Number(evt.target.value));
  };

  if (!locationId) return null;

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>Location</InputLabel>
        <Select
          value={locationId}
          label="Location"
          onChange={handleLocationChange}
        >
          {locations.map((item) => (
            <MenuItem value={item.id}>{item.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SettingsPage;
