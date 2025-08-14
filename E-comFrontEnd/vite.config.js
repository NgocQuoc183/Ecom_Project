
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jwt-decode'], // Đảm bảo jwt-decode được optimize
  },
  server: {
    proxy: {
      '/api': {  // Proxy tất cả request bắt đầu bằng /api
        target: 'http://localhost:3001',  // Địa chỉ backend
        changeOrigin: true,  // Thay đổi origin để tránh CORS
        secure: false,  // Không yêu cầu HTTPS (dùng cho localhost)
      },
    },
  },
});
