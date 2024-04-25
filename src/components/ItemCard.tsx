import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Paper, Typography } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  isAvailable?: boolean;
  href?: string;
  subtitle?: string;
  selected?: boolean;
  onClick?: () => void;
}

const ItemCard = ({
  icon,
  title,
  isAvailable,
  href,
  subtitle,
  selected,
  onClick,
}: Props) => {
  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", color: "#000000" }}>
        <Paper
          elevation={2}
          sx={{
            width: 170,
            height: 170,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            m: 2,
            opacity: isAvailable === false ? 0.4 : 1,
          }}
        >
          {icon}
          <Typography sx={{ color: "#4C4C6D", fontWeight: "700" }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ color: "#4C4C6D", fontSize: 14 }}>
              {subtitle}
            </Typography>
          )}
        </Paper>
      </Link>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        width: 170,
        height: 170,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        m: 2,
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() => onClick && onClick()}
    >
      {selected && (
        <CheckCircleOutlineIcon
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            fontSize: "30px",
            color: "#1B9C85",
          }}
        />
      )}
      {icon}
      <Typography sx={{ color: "#4C4C6D", fontWeight: "700" }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ color: "#4C4C6D", fontSize: 14 }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default ItemCard;
