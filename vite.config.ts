import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react()],
    server: {
      // 프론트의 /api 요청을 백엔드 서버로 전달한다.
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "https://3.36.87.221/",
          changeOrigin: true,
        },
      },
    },
  };
});
