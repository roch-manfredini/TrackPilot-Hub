import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const ssrTempDir = path.join(rootDir, '.ssr-temp');

async function prerender() {
  try {
    await build({
      root: rootDir,
      logLevel: 'silent',
      build: {
        ssr: path.join(rootDir, 'src/entry-server.tsx'),
        outDir: ssrTempDir,
        emptyOutDir: true,
        rollupOptions: {
          output: {
            format: 'es',
            entryFileNames: 'entry-server.mjs',
          },
        },
      },
    });

    const serverEntryUrl = pathToFileURL(path.join(ssrTempDir, 'entry-server.mjs')).href;
    const { render, getFaqJsonLd } = await import(serverEntryUrl);

    const appHtml = render();
    const faqJsonLd = getFaqJsonLd();

    const indexPath = path.join(distDir, 'index.html');
    let html = await fs.readFile(indexPath, 'utf-8');

    const rootMarker = '<div id="root"></div>';
    if (!html.includes(rootMarker)) {
      throw new Error(`Could not find "${rootMarker}" in ${indexPath}`);
    }
    html = html.replace(rootMarker, `<div id="root">${appHtml}</div>`);

    const faqMarker = '<!-- FAQ_JSON_LD -->';
    if (!html.includes(faqMarker)) {
      throw new Error(`Could not find "${faqMarker}" in ${indexPath}`);
    }
    const faqScript = `<script type="application/ld+json">${faqJsonLd}</script>`;
    html = html.replace(faqMarker, faqScript);

    await fs.writeFile(indexPath, html, 'utf-8');

    // Keep sitemap lastmod aligned with the build date
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    const today = new Date().toISOString().slice(0, 10);
    const sitemap = await fs.readFile(sitemapPath, 'utf-8');
    const updatedSitemap = sitemap.replace(
      /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/,
      `<lastmod>${today}</lastmod>`,
    );
    await fs.writeFile(sitemapPath, updatedSitemap, 'utf-8');

    console.log(`[prerender] Injected ${appHtml.length} bytes of HTML and FAQPage JSON-LD into dist/index.html`);
  } finally {
    await fs.rm(ssrTempDir, { recursive: true, force: true });
  }
}

prerender().catch((err) => {
  console.error('[prerender] Failed:', err);
  process.exit(1);
});
