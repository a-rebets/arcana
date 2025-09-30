/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/** biome-ignore-all lint/correctness/noUnusedVariables: Vite globals */

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string;
  readonly VITE_CONVEX_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
