// @ts-check
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import favicons from 'astro-favicons';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), favicons()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});