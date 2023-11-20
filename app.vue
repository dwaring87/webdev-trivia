<script setup>
  const BASE_TITLE = "Atlas QuizBowl"
  useHead({
    titleTemplate: (title) => {
      return title && title.includes(BASE_TITLE) ? title : title ? `${BASE_TITLE} - ${title}` : BASE_TITLE;
    },
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    charset: 'utf-8',
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Trivia score sheet for Atlas QuizBowl', hid: 'description' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-TileColor', content: '#065f46' },
      { name: 'theme-color', content: '#065f46' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png?v=2' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png?v=1' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png?v=1' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png?v=1' },
      { rel: 'manifest', href: '/site.webmanifest?v=2' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg?v=3', color: '#065f46' },
      { rel: 'shortcut icon', href: '/favicon.ico?v=2' }
    ]
  });
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>