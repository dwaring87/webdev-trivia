<script setup>
  import MdiFacebook from '~icons/mdi/facebook';
  const { public:config } = useRuntimeConfig();
</script>

<template>
  <footer class="bg-gray-200 border-t-1 border-gray-400">
    <div class="text-center text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
      <p>{{ config.app_title }}</p>
      <p v-if="config.social_facebook">
        <NuxtLink :to="config.social_facebook">
          <MdiFacebook class='inline' />
        </NuxtLink>
      </p>
    </div>
  </footer>
</template>