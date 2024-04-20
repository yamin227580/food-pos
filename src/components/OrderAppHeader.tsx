import Home from "@mui/icons-material/Home";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  cartItemCount: number;
}

const OrderAppHeader = ({ cartItemCount }: Props) => {
  const router = useRouter();
  const isHome = router.pathname === "/order";
  const isCart = router.pathname === "/order/cart";
  const isActiveOrder = router.pathname.includes("/order/activeOrder");
  const isCartOrActiveOrderPage = isCart || isActiveOrder;

  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "fixed",
        zIndex: 5,
        top: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: { xs: 40, md: 80, lg: 200 },
          cursor: "pointer",
        }}
      >
        {isCartOrActiveOrderPage ? (
          <Home
            onClick={() =>
              router.push({
                pathname: "/order",
                query: router.query,
              })
            }
            sx={{
              fontSize: "40px",
              color: "#FFE194",
            }}
          />
        ) : (
          <>
            <ShoppingCartCheckoutIcon
              onClick={() =>
                router.push({ pathname: "/order/cart", query: router.query })
              }
              sx={{
                fontSize: "40px",
                color: "#FFE194",
              }}
            />
            {cartItemCount > 0 && (
              <Typography
                variant="h5"
                sx={{
                  textAlign: "right",
                  color: "#E8F6EF",
                  position: "absolute",
                  top: -10,
                  right: -10,
                }}
              >
                {cartItemCount}
              </Typography>
            )}
          </>
        )}
      </Box>

      <Image
        src="/order-app-header.svg"
        //to get the dimension of the original image,use like this
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        alt="header-image"
      />
      {isHome && (
        <Box sx={{ position: "absolute" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#4C4C6D",
                mt: 15,
              }}
            >
              Ah Wa Sarr
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontStyle: "italic", lineHeight: 1.2 }}
            >
              Hintada Street 39
              <br /> Sanchaung, Yangon
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(OrderAppHeader);
