import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'TripleUMDM Docs',
  description: 'A guide website that will help you set up or troubleshoot TripleUMDM.',
  appearance: false,
  themeConfig: {
    siteTitle: 'TripleUMDM Docs',
    logo: '/logo.png',
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Getting Started', link: '/getting-started/' },
      { text: 'Android Overview', link: '/android-overview/' },
      { text: 'Website Basics', link: '/website/' },
      { text: 'Website Features', link: '/website-features/' },
    ],
    sidebar: {
      '/': [
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
        {
          text: 'Website Basics',
          link: '/website/',
          items: [
            { text: 'Home', link: '/website/home/' },
            { text: 'System', link: '/website/system/' },
            { text: 'Installation', link: '/website/installation/' },
            { text: 'Store', link: '/website/store/' },
            { text: 'Accessibility', link: '/website/accessibility/' },
            { text: 'Network', link: '/website/network/' },
            { text: 'Apps', link: '/website/apps/' },
            { text: 'Settings', link: '/website/settings/' },
          ],
        },
        {
          text: 'Website Features',
          link: '/website-features/',
          items: [
            { text: 'Device Notes', link: '/website-features/device-notes/' },
            { text: 'Remote Lockout', link: '/website-features/remote-lockout/' },
            { text: 'Remote App Approval', link: '/website-features/app-approval/' },
            { text: 'APK Upload & Assignment', link: '/website-features/apk-upload/' },
            { text: 'Remote Control', link: '/website-features/remote-control/' },
            { text: 'Send Notification', link: '/website-features/send-notification/' },
            { text: 'Uninstall MDM', link: '/website-features/uninstall/' },
            { text: 'Factory Reset', link: '/website-features/factory-reset/' },
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
