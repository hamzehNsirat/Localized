import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@visactor/vchart'], // Ensure the library is pre-bundled by Vite
  },
  resolve: {
    alias: {
      '@visactor/vchart': '/node_modules/@visactor/vchart', // Ensure correct resolution
    },
  },
});
