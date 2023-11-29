<script setup>
  const props = defineProps({
    team: String
  });
</script>

<template>
  <td>
    <p class="mx-2 md:mx-0">{{ team }}</p>
  </td>
</template>