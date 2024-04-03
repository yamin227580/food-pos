import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetSnackbar } from "@/store/slices/snackbarSlice";

import { Alert, Snackbar as MuiSnackBar } from "@mui/material";

const Snackbar = () => {
  const { open, severity, message, autoHideDuration } = useAppSelector(
    (state) => state.snackbar
  );

  const dispatch = useAppDispatch();

  setTimeout(() => dispatch(resetSnackbar()), autoHideDuration);
  return (
    <MuiSnackBar
      open={open}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </MuiSnackBar>
  );
};

export default Snackbar;
