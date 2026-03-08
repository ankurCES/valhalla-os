import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true,
		port: 5173,
		strictPort: true,
		allowedHosts: true, // Vite 6+ needs this, Vite 5 might need different
		hmr: {
			clientPort: 80
		}
	}
});
