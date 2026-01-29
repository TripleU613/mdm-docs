import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'TripleUMDM Docs',
  description: 'A guide website that will help you set up or troubleshoot TripleUMDM.',
  appearance: true,
  themeConfig: {
    siteTitle: 'TripleUMDM Docs',
    logo: '/logo.png',
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/TripleU613/TripleUMDM_Public' },
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3Zm-7-2a2 2 0 1 1 4 0v2h-4V6Zm8 11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6Z"/></svg>',
        },
        link: 'https://tripleumdm.com',
      },
    ],
    editLink: {
      pattern: 'https://github.com/TripleU613/mdm-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    lastUpdated: {
      text: 'Last updated',
    },
    nav: [
      { text: 'Getting Started', link: '/getting-started/' },
      { text: 'Android Overview', link: '/android-overview/' },
      { text: 'Website Basics', link: '/website/' },
      { text: 'Website Features', link: '/website-features/' },
      { text: 'VPN System', link: '/vpn/' },
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
        {
          text: 'VPN System',
          link: '/vpn/',
          items: [
            { text: 'VPN Introduction', link: '/vpn/' },
            { text: 'Control Options', link: '/vpn/controls/' },
            { text: 'Website Configuration', link: '/vpn/website-config/' },
            { text: 'Filtering Rules', link: '/vpn/filtering/' },
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
