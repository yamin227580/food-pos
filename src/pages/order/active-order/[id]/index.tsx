import OrderCard from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { refreshOrder } from "@/store/slices/orderSlice";
import { formatOrders } from "@/utils/general";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ActiveOrder = () => {
  const router = useRouter();
  const orderSeq = String(router.query.id);
  const orders = useAppSelector((state) => state.order.items);
  const addons = useAppSelector((state) => state.addon.items);
  const menus = useAppSelector((state) => state.menu.items);
  const tables = useAppSelector((state) => state.table.items);
  const orderItems = formatOrders(orders, addons, menus, tables);

  const dispatch = useAppDispatch();
  let intervalId: number;

  useEffect(() => {
    if (orders.length) {
      intervalId = window.setInterval(() => handleRefreshOrder(), 10000);
    }
    // this code will run when the component is unamount
    return () => {
      clearInterval(intervalId);
    };
  }, [orders]);

  const handleRefreshOrder = () => {
    dispatch(refreshOrder({ orderSeq }));
  };
  if (!orders.length) return null;

  return (
    <Box sx={{ position: "relative", top: { xs: 30, sm: 100 }, zIndex: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 3,
          bgcolor: "#E8F6EF",
          borderRadius: 15,
          mx: 3,
          flexDirection: "column",
          alignItems: "center",
          mt: { xs: 4 },
        }}
      >
        <Typography>OrderSeq: {orderSeq}</Typography>
        <Typography>Total price : {orders[0].totalPrice}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {orderItems.map((orderItem) => {
          return (
            <OrderCard
              key={orderItem.itemId}
              orderItem={orderItem}
              isAdmin={false}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ActiveOrder;
