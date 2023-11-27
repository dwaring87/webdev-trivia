<script setup>
  const props = defineProps({
    round: Number
  });
</script>

<template>
  <div class="py-1">
    <p>Round {{ round }}</p>
  </div>
</template>