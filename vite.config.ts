import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, type Plugin } from 'vite'
import { jsonLd, llmsTxt, profileHtml, robotsTxt, sitemapXml } from './src/lib/seo.ts'

// AI crawlers read the raw HTML and never run JavaScript, so #root ships with the whole profile in it.
// React replaces it on mount; until then it stays hidden, unless scripts are off and it is all there is.
function staticProfile(): Plugin {
  const root = '<div id="root"></div>'
  return {
    name: 'static-profile',
    transformIndexHtml(html) {
      if (!html.includes(root)) throw new Error(`static-profile: ${root} not found in index.html`)
      return {
        html: html.replace(root, `<div id="root">${profileHtml()}</div>`),
        tags: [
          { tag: 'script', attrs: { type: 'application/ld+json' }, children: jsonLd(), injectTo: 'head' },
          {
            tag: 'link',
            attrs: { rel: 'alternate', type: 'text/markdown', href: '/llms.txt', title: 'Profil en Markdown' },
            injectTo: 'head',
          },
          { tag: 'style', children: '#root > .static-profile { display: none }', injectTo: 'head' },
          {
            tag: 'noscript',
            children:
              '<style>#root > .static-profile { display: block; max-width: 44rem; margin: 0 auto; padding: 2rem 1rem }' +
              ' .static-profile ul { list-style: disc; padding-left: 1.25rem }</style>',
            injectTo: 'head',
          },
        ],
      }
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt() })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml() })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    staticProfile(),
  ],
})
