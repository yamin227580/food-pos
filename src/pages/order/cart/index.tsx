import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { emptyCart, removeFromCart } from "@/store/slices/cartSlice";
import { createOrder } from "@/store/slices/orderSlice";
import { CartItem } from "@/types/cart";
import { getCartTotalPrice } from "@/utils/general";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import { Addon, Order } from "@prisma/client";
import { useRouter } from "next/router";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const router = useRouter();
  const tableId = Number(router.query.tableId);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (!cartItems.length) {
  //     router.push({ pathname: "/order", query: router.query });
  //   }
  // }, [cartItems]);

  const renderAddons = (addons: Addon[]) => {
    if (!addons.length) return;
    return addons.map((item) => {
      const category = addonCategories.find(
        (ele) => ele.id === item.addonCategoryId
      );

      return (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography color={"primary"} sx={{ fontStyle: "italic" }}>
            <span style={{ color: "darkBlue", fontSize: "1.2rem" }}>
              {category?.name}
            </span>
            - {item.name}
          </Typography>
          <Typography color={"primary"} sx={{ fontStyle: "italic" }}>
            {item.price}
          </Typography>
        </Box>
      );
    });
  };

  const handleRemoveFromCart = (cartItem: CartItem) => {
    dispatch(removeFromCart(cartItem));
  };

  const confirmOrder = async () => {
    const isValid = tableId;
    if (!isValid) return alert("Table Id");
    dispatch(
      createOrder({
        tableId,
        cartItems,
        onSuccess: (orders: Order[]) => {
          dispatch(emptyCart());
          router.push({
            pathname: `/order/active-order/${orders[0].orderSeq}`,
            query: { tableId },
          });
        },
      })
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 3,
        bgcolor: "#E8F6EF",
        borderRadius: 15,
        mx: 3,
        position: "relative",
        top: 150,
        zIndex: 5,
      }}
    >
      {!cartItems.length ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <Box
          sx={{
            width: { xs: "100%", md: "500px" },
          }}
        >
          <Typography
            color={"primary"}
            variant="h4"
            sx={{ textAlign: "center", mb: 3 }}
          >
            Review your order
          </Typography>
          {cartItems.map((cartItem) => {
            const { menu, addons, quantity } = cartItem;
            return (
              <Box key={cartItem.id}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 25,
                      height: 25,
                      mr: 1,
                      backgroundColor: "#1B9C85",
                    }}
                  >
                    {quantity}
                  </Avatar>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography variant="h6" color={"primary"}>
                      {menu.name}
                    </Typography>
                    <Typography variant="h6" color={"primary"}>
                      {menu.price}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ pl: 6 }}>{renderAddons(addons)}</Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 3,
                    mt: 1,
                  }}
                >
                  <DeleteIcon
                    color="primary"
                    sx={{ mr: 2, cursor: "pointer" }}
                    onClick={() => handleRemoveFromCart(cartItem)}
                  />
                  <EditIcon
                    color="primary"
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      router.push({
                        pathname: `menus/${menu.id}`,
                        query: { ...router.query, cartItemId: cartItem.id },
                      })
                    }
                  />
                </Box>
              </Box>
            );
          })}
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Typography variant="h4" color="primary">
              Total: {getCartTotalPrice(cartItems)}
            </Typography>
          </Box>
          <Box sx={{ mt: 3, textAlign: "center" }} onClick={confirmOrder}>
            <Button variant="contained">Confirm order</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Cart;
