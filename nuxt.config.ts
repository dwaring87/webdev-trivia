import Icons from 'unplugin-icons/vite';

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: [ '~/assets/default.css' ],
  modules: [ '@nuxtjs/tailwindcss', '@vueuse/nuxt', '@vite-pwa/nuxt' ],
  vite: {
    plugins: [ Icons({ autoInstall: true }) ]
  },
  pwa: {
    registerType: 'autoUpdate',
    registerWebManifestInRouteRules: true,
    manifest: {
      name: process.env.APP_TITLE,
      short_name: process.env.APP_TITLE,
      theme_color: '#075985',
      start_url: "/",
      orientation: "any",
      icons: [
        {
          "src": "/icons/icon-48x48.png",
          "sizes": "48x48",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/icons/icon-72x72.png",
          "sizes": "72x72",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/icons/icon-96x96.png",
          "sizes": "96x96",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/icons/icon-128x128.png",
          "sizes": "128x128",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/icons/icon-144x144.png",
          "sizes": "144x144",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/icons/icon-152x152.png",
          "sizes": "152x152",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/icons/icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/icons/icon-384x384.png",
          "sizes": "384x384",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/icons/icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable any"
        }
      ]
    }
  }
})
