import { Cormorant_Garamond, Great_Vibes } from "next/font/google";

export const script = Great_Vibes({ weight: "400", subsets: ["latin"], display: "swap" });

export const serif = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
