import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import babel from "vite-plugin-babel";

export default defineConfig({
  define: {
    "import.meta.env.VITE_DEPLOYMENT_URL": JSON.stringify(
      `https://${process.env.VERCEL_URL ?? "www.tryarcana.app"}`
    )
  },
  plugins: [
    tailwindcss(),
    svgr(),
    reactRouter(),
    babel({
      filter: /src\/.*\.tsx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: [
          ["babel-plugin-react-compiler"],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@convex": path.resolve(__dirname, "./convex/_generated"),
    },
  },
});
