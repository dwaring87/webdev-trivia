<script setup>
  import MdiFacebook from '~icons/mdi/facebook';
  import MdiWeb from '~icons/mdi/web';
  import MdiGithub from '~icons/mdi/github';

  const { public:config } = useRuntimeConfig();
</script>

<template>
  <footer class="bg-gray-200 border-t-1 border-gray-400">
    <div class="text-center text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
      <p>{{ config.title }}</p>
      <div class="flex gap-x-4 justify-center mt-2">
        <p v-for="(item, index) in config.social" :key="`social-${index}`">
          <NuxtLink :to="item.url" :title="item.name" target="_blank">
            <MdiFacebook v-if="item.type === 'facebook'" class='inline' />
            <MdiWeb v-else-if="item.type === 'web'" class='inline' />
          </NuxtLink>
        </p>
        <p>
          <NuxtLink to="https://github.com/dwaring87/webdev-trivia" title="Source Code" target="_blank">
            <MdiGithub class="inline" />
          </NuxtLink>
        </p>
      </div>
    </div>
  </footer>
</template>