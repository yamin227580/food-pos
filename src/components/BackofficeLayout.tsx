import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import SideBar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: ReactNode;
}
const BackofficeLayout = ({ children }: Props) => {
  const { data: session } = useSession();
  const init = useAppSelector((state) => state.app.init);
  const { isReady, ...router } = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session && !init) {
      dispatch(fetchAppData({}));
    }
  }, [session]);

  useEffect(() => {
    if (isReady && !session) {
      router.push("/backoffice");
    }
  }, [isReady]);

  return (
    <Box>
      <Topbar />
      <Box sx={{ display: "flex", position: "relative", zIndex: 5, flex: 1 }}>
        {session && (
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <SideBar />
          </Box>
        )}
        <Box sx={{ p: 3, width: "100%", height: "100%" }}>{children}</Box>
      </Box>
    </Box>
  );
};
export default BackofficeLayout;
