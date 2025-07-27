// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    // Pastikan path ini benar untuk file-file Anda
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;