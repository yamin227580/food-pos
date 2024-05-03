import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box, Typography } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OrderAppHeader from "./OrderAppHeader";

interface Props {
  children: string | JSX.Element | JSX.Element[];
}

const OrderLayout = (props: Props) => {
  const router = useRouter();
  const { tableId } = router.query;
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const isHome = router.pathname === "/order";
  const orders = useAppSelector((state) => state.order.items);
  const isActiveOrderPage = router.pathname.includes("active-order");
  const showActiveFooterPage =
    !isActiveOrderPage &&
    orders.some(
      (item) =>
        item.status === ORDERSTATUS.PENDING ||
        item.status === ORDERSTATUS.COOKING
    );

  useEffect(() => {
    if (tableId) {
      dispatch(fetchAppData({ tableId: Number(tableId) }));
    }
  }, [tableId]);

  return (
    <Box>
      <OrderAppHeader cartItemCount={items.length} />
      <Box
        sx={{
          position: "relative",
          mb: 10,
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "80%", lg: "55%" }, m: "0 auto" }}>
          {props.children}
        </Box>
      </Box>
      {showActiveFooterPage && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            bgcolor: "primary.main",
            width: "100vw",
            height: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            zIndex: 7,
          }}
          onClick={() =>
            router.push({
              pathname: `/order/active-order/${orders[0].orderSeq}`,
              query: router.query,
            })
          }
        >
          <Typography sx={{ color: "#4C4C6D", userSelect: "none" }}>
            You have active orders.Click here to view.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OrderLayout;
