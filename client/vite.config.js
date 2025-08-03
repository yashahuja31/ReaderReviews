import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests from '/api' to your hosted Render backend
      '/api': {
        target: 'https://readerreviews.onrender.com',
        changeOrigin: true,
        secure: false, 
      }
    }
  }
});
