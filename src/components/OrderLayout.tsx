import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
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
    </Box>
  );
};

export default OrderLayout;
