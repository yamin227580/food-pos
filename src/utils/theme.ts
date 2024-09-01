import { store } from "@/store";
import { createTheme } from "@mui/material";

const getDesignTokens = () => {
  const state = store.getState();
  const { theme } = state.app;

  if (theme === "light") {
    return {
      palette: {
        primary: {
          main: "#E9C874",
        },
        secondary: {
          main: "#FBF8DD",
        },
        info: {
          main: "#E8F6EF",
        },
        success: {
          main: "#A34343",
        },
      },
    };
  } else {
    return {
      palette: {
        primary: {
          main: "#e63946",
        },
        secondary: {
          main: "#a8dadc",
        },
        info: {
          main: "#f1faee",
        },
        success: {
          main: "#1d3557",
        },
      },
    };
  }
};
export const theme = createTheme(getDesignTokens());
