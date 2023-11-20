import Icons from 'unplugin-icons/vite';

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [ '~/assets/default.css' ],
  modules: [ '@nuxtjs/tailwindcss' ],
  vite: {
    plugins: [ Icons({ autoInstall: true }) ]
  }
})
