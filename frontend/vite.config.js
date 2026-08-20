/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    plugins: [react()],
    // Serve at root by default; can be overridden with VITE_BASE_PATH
    base: env.VITE_BASE_PATH || '/',
  });
};
