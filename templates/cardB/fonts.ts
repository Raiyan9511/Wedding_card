import { Parisienne, Playfair_Display } from "next/font/google";

export const script = Parisienne({ weight: "400", subsets: ["latin"], display: "swap" });

export const serif = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
