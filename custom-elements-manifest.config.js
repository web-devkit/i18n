import { customElementJetBrainsPlugin } from "custom-element-jet-brains-integration";
import { customElementVsCodePlugin } from "custom-element-vs-code-integration";

export default {
  globs: ["src/**/*.ts"],
  exclude: ["src/index.ts"],
  outdir: "dist",
  litelement: true,
  plugins: [
    customElementJetBrainsPlugin({
      outdir: "dist",
      packageJson: true,
    }),
    customElementVsCodePlugin({
      outdir: "dist",
      packageJson: true,
    }),
  ],
};
