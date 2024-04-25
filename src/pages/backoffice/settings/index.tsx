import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCompany } from "@/store/slices/companySlice";
import { UpdateCompanyOptions } from "@/types/company";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const company = useAppSelector((state) => state.company.item);

  const [data, setData] = useState<UpdateCompanyOptions>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      setData({
        id: company.id,
        name: company.name,
        street: company.street,
        township: company.township,
        city: company.city,
      });
    }
  }, [company]);

  if (!company || !data) return null;

  const handleUpdateCompany = () => {
    dispatch(updateCompany(data));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TextField
        defaultValue={data.name}
        sx={{ mb: 2 }}
        onChange={(evt) => setData({ ...data, name: evt.target.value })}
      />
      <TextField
        defaultValue={data.street}
        sx={{ mb: 2 }}
        onChange={(evt) => setData({ ...data, street: evt.target.value })}
      />
      <TextField
        defaultValue={data.township}
        sx={{ mb: 2 }}
        onChange={(evt) => setData({ ...data, township: evt.target.value })}
      />
      <TextField
        defaultValue={data.city}
        sx={{ mb: 2 }}
        onChange={(evt) => setData({ ...data, city: evt.target.value })}
      />
      <Button
        variant="contained"
        sx={{ mt: 2, width: "fit-content" }}
        onClick={handleUpdateCompany}
      >
        Update
      </Button>
    </Box>
  );
};

export default SettingsPage;
