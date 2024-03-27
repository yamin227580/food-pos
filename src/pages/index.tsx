import { Box, Button, Typography } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <Box>
        <Typography>Not Sign In</Typography>
        <Button variant="contained" onClick={() => signIn()}>
          Sign In
        </Button>
      </Box>
    );
  }
  return (
    <Box>
      <Typography>Signed In</Typography>
      <Button variant="contained" onClick={() => signOut()}>
        Sign Out
      </Button>
    </Box>
  );
}
