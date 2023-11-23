import Icons from 'unplugin-icons/vite';

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: [ '~/assets/default.css' ],
  modules: [ '@nuxtjs/tailwindcss', '@vueuse/nuxt' ],
  vite: {
    plugins: [ Icons({ autoInstall: true }) ]
  }
})
