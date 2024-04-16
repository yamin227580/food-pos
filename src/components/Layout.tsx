import BackofficeLayout from "@/components/BackofficeLayout";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import OrderLayout from "./OrderLayout";

interface Props {
  children: string | JSX.Element | JSX.Element[];
}

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const { companyId, tableId } = router.query;
  const isOrderApp = companyId && tableId;
  // const isOrderApp = router.pathname === "/order";
  const isBackofficeApp = router.pathname.includes("/backoffice");

  if (isOrderApp) {
    return (
      <Box sx={{ height: "100%" }}>
        <OrderLayout>{children}</OrderLayout>
      </Box>
    );
  }

  if (isBackofficeApp) {
    return (
      <Box sx={{ height: "100%" }}>
        <BackofficeLayout>{children}</BackofficeLayout>
      </Box>
    );
  }

  return <Box>{children}</Box>;
};

export default Layout;
