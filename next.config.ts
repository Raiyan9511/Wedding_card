import type { NextConfig } from "next";
import { clientConfig } from "./client.config";
import { registry } from "./templates/registry";

const nextConfig: NextConfig = {
  turbopack: {
    // A stray package-lock.json in the home folder made Next guess the wrong root.
    root: __dirname,
    // Build-time card selection: only this folder is compiled into the site.
    resolveAlias: {
      "@selected-card": `./templates/${registry[clientConfig.template]}/index.tsx`,
    },
    // `import url from "./x.mp4"` → the emitted file's URL. Only videos the selected card imports ship.
    rules: { "*.mp4": { type: "asset" } },
  },
};

export default nextConfig;
