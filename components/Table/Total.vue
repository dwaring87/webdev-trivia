<script setup>
  const props = defineProps({
    team: String
  });

  const { scores } = useGame();
  const total = computed(() => {
    const t = scores.value[props.team].total;
    return !!t ? t : '&mdash;';
  })
</script>

<template>
  <p class="font-semibold" v-html="total"></p>
</template>