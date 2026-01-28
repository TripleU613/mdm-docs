import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'TripleUMDM Docs',
  description: 'A guide website that will help you set up or troubleshoot TripleUMDM.',
  appearance: false,
  themeConfig: {
    siteTitle: 'TripleUMDM Docs',
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Getting Started', link: '/getting-started/' },
      { text: 'Android Overview', link: '/android-overview/' },
    ],
    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: [
            {
              text: 'Getting Started',
              link: '/getting-started/',
              items: [
                { text: 'Terms & Privacy', link: '/getting-started/terms/' },
                { text: 'Account Setup', link: '/getting-started/account/' },
                { text: 'Permissions & Installation', link: '/getting-started/permissions/' },
              ],
            },
            {
              text: 'Android Overview',
              link: '/android-overview/',
              items: [
                { text: 'Lock Screen', link: '/android-overview/lock-screen/' },
                { text: 'System Tab', link: '/android-overview/system/' },
                { text: 'Installation Tab', link: '/android-overview/installation/' },
                { text: 'Accessibility Tab', link: '/android-overview/accessibility/' },
                { text: 'Network Tab', link: '/android-overview/network/' },
                { text: 'Store Tab', link: '/android-overview/store/' },
                { text: 'Apps Tab', link: '/android-overview/apps/' },
                { text: 'Settings Tab', link: '/android-overview/settings/' },
              ],
            },
          ],
        },
      ],
    },
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 200,
      },
    },
    plugins: [
      {
        name: 'vitepress-html-redirect',
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            if (req.url && req.url.endsWith('.html')) {
              req.url = req.url.replace(/\.html$/, '/')
            }
            next()
          })
        },
      },
    ],
  },
})
