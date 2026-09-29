import { Fraunces, Sacramento } from "next/font/google";

/** Light, airy monoline script. */
export const script = Sacramento({ weight: "400", subsets: ["latin"], display: "swap" });

/** Rounded serif: Fraunces with its SOFT axis turned up (set in cardC.module.css). */
export const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});
