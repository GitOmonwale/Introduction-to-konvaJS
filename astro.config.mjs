import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    preact(), // Assure-toi que ceci est présent
    tailwind()
  ],
});
