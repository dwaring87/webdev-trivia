<script setup>
  const { public:config } = useRuntimeConfig();
  const BASE_TITLE = config.app_title;

  useHead({
    titleTemplate: (title) => {
      return title && title.includes(BASE_TITLE) ? title : title ? `${BASE_TITLE} - ${title}` : BASE_TITLE;
    },
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    charset: 'utf-8',
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: `Trivia score sheet for ${BASE_TITLE}`, hid: 'description' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-TileColor', content: '#075985' },
      { name: 'theme-color', content: '#075985' }
    ],
    link: [
      { rel: 'manifest', href: '/manifest.webmanifest' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#075985' },
      { rel: 'shortcut icon', href: '/favicon.ico' }
    ]
  });
</script>

<template>
  <div>
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>