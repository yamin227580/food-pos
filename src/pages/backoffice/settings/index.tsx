import { useAppSelector } from "@/store/hooks";
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

  useEffect(() => {
    if (locations.length) {
      const selectedLocationId = localStorage.getItem("selectedLocationId");
      if (selectedLocationId) {
        setLocationId(Number(selectedLocationId));
      } else {
        const firstLocationId = locations[0].id;
        setLocationId(Number(firstLocationId));
        localStorage.setItem("selectedLocationId", String(firstLocationId));
      }
    }
  }, [locations]);

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
