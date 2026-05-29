// @ts-check
import { defineConfig } from 'astro/config';
import { execSync } from 'child_process';
import path from 'path';

function markdownWatcherPlugin() {
  return {
    name: 'markdown-watcher-plugin',
    // @ts-ignore
    configureServer(server) {
      const filePath = path.resolve('how cbse rewrote rules to favor coempt eduteck.md');
      
      // Watch the root markdown file
      server.watcher.add(filePath);
      
      // Listen for change events
      server.watcher.on('change', (changedPath) => {
        if (changedPath === filePath) {
          console.log('\n[Watcher] Root markdown changed! Recompiling...');
          try {
            execSync('node process-images.cjs');
            console.log('[Watcher] Successfully recompiled!\n');
          } catch (err) {
            console.error('[Watcher] Recompile failed:', err.message);
          }
        }
      });
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://Sarthak-Sidhant.github.io',
  base: '/coempt',
  vite: {
    plugins: [markdownWatcherPlugin()]
  }
});
