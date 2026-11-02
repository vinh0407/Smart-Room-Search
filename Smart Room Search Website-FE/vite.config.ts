import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function liveRoomsDevPlugin() {
  return {
    name: 'live-rooms-dev-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = new URL(req.url, 'http://localhost');
        if (url.pathname === '/api/rooms/live') {
          try {
            const { default: handler } = await import('./api/rooms/live.js');
            req.query = Object.fromEntries(url.searchParams.entries());
            return handler(req, res);
          } catch (e) {
            console.error('Dev live handler error:', e);
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    liveRoomsDevPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],
})
