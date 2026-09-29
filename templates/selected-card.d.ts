// Type for the build-time alias defined in next.config.ts.
declare module "@selected-card" {
  const Card: import("react").ComponentType<import("@/lib/types").CardProps>;
  export default Card;
}

// Videos a card imports (turbopack.rules in next.config.ts) resolve to their URL.
declare module "*.mp4" {
  const src: string;
  export default src;
}
