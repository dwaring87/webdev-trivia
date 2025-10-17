import Icons from 'unplugin-icons/vite';
import { useMD5 } from './composables/useMD5';

// Parse social string into array of objects
// type,name,url|type,name,url...
const social = [];
(process.env.APP_SOCIAL || '').split('|').forEach((item) => {
  const parts = item.split(',');
  social.push({
    type: parts[0],
    name: parts[1],
    url: parts[2]
  });
});

// Hash the invite code
const invite_code_hash = useMD5(process.env.APP_INVITE_CODE);


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
  },
  runtimeConfig: {
    public: {
      title: process.env.APP_TITLE || 'Trivia Score Sheet',
      rounds: process.env.APP_ROUNDS || 5,
      social: social,
      invite_code_hash: invite_code_hash,
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY || 'NOT_SET',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'NOT_SET'
      }
    }
  }
});