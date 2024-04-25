import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box, Typography } from "@mui/material";
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

  useEffect(() => {
    if (tableId) {
      dispatch(fetchAppData({ tableId: Number(tableId) }));
    }
  }, [tableId]);

  return (
    <Box>
      <OrderAppHeader cartItemCount={items.length} />
      <Box sx={{ position: "relative", top: isHome ? 240 : 0 }}>
        <Box sx={{ width: { xs: "100%", md: "80%", lg: "55%" }, m: "0 auto" }}>
          {props.children}
        </Box>
      </Box>
      {orders.length && !isActiveOrderPage && (
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
          }}
          onClick={() =>
            router.push({
              pathname: `/order/active-order/${orders[0].orderSeq}`,
              query: router.query,
            })
          }
        >
          <Typography
            variant="h6"
            sx={{ color: "secondary.main", userSelect: "none" }}
          >
            You have active orders.Click here to view.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OrderLayout;
