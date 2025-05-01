import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ReKindle/', // This ensures your app works with GitHub Pages
  plugins: [react()],
});
