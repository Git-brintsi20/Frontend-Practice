import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Allow external connections
    hmr: {
      clientPort: 5173, // Ensure HMR uses the correct port
      protocol: 'ws', // Explicitly use WebSocket
    },
  },
});