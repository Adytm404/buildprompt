import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const baseUrl = env.VITE_AI_BASE_URL || 'http://localhost:20128/v1';

  let defaultTarget = 'http://localhost:20128';
  try {
    defaultTarget = new URL(baseUrl).origin;
  } catch {
    defaultTarget = 'http://localhost:20128';
  }
  const proxyTarget = env.VITE_AI_PROXY_TARGET || defaultTarget;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/ai': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (requestPath) => requestPath.replace(/^\/ai/, ''),
        },
      },
    },
  };
});
