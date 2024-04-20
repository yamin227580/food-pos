import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Topbar = () => {
  const { data } = useSession();
  const { selectedLocation } = useAppSelector((state) => state.location);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "success.main",
        px: 2,
      }}
    >
      <Box sx={{ height: 70 }}>
        <Image src={"/logo.png"} alt="logo" width={150} height={70} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" color={"secondary"}>
          Foodie POS
        </Typography>
        <Typography color={"secondary"} sx={{ fontSize: 12 }}>
          {selectedLocation?.name}
        </Typography>
      </Box>
      {data ? (
        <Box>
          <Button
            variant="contained"
            onClick={() => signOut({ callbackUrl: "/backoffice" })}
          >
            Sign Out
          </Button>
        </Box>
      ) : (
        <span />
      )}
    </Box>
  );
};
export default Topbar;
