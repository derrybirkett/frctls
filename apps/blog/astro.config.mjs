// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://fractalsofchange.github.io',
	base: '/frctls',
	integrations: [mdx(), sitemap()],
	build: {
		assets: 'assets'
	}
});
