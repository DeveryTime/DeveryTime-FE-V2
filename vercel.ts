import {deploymentEnv, routes, type VercelConfig} from "@vercel/config/v1";

const apiUrl = deploymentEnv("VITE_API_PROXY_TARGET");

if (!apiUrl) {
  throw new Error("VITE_API_PROXY_TARGET is required");
}

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite(
      "/api/:path*",
      `${apiUrl.replace(/\/+$/, "")}/:path*`,
    ),
    routes.rewrite("/(.*)", "/index.html"),
  ],
};