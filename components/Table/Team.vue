<script setup>
  const props = defineProps({
    team: String
  });
</script>

<template>
  <td>
    <p>{{ team }}</p>
  </td>
</template>