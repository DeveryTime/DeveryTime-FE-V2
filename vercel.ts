import { routes, type VercelConfig } from "@vercel/config/v1";

const API_ORIGIN = "https://3.36.87.221";

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite("/api/:path*", `${API_ORIGIN}/api/:path*`),
    routes.rewrite("/(.*)", "/"),
  ],
};
