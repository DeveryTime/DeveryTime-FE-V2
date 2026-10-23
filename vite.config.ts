import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // 프론트의 /api 요청을 백엔드 서버로 전달한다.
    proxy: {
      "/api": {
        target: "https://3.36.87.221",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
