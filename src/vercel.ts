import {deploymentEnv, type VercelConfig} from "@vercel/config/v1";

const apiUrl = deploymentEnv("VITE_API_PROXY_TARGET");

if (!apiUrl) {
  throw new Error("VITE_API_PROXY_TARGET is required");
}

export const config: VercelConfig = {
  rewrites: [
    {
      source: "/api/:path*",
      destination: `${apiUrl.replace(/\/+$/, '')}/:path*`,
    },
    {
      source: '/(.*)',
      destination: 'index.html',
    },
  ],
};