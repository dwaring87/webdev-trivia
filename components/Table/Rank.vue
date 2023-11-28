<script setup>
  const props = defineProps({
    team: String
  });

  const { scores } = useGame();
  const rank = computed(() => {
    const r = scores.value[props.team].rank;
    return !!r ? r : '&mdash;';
  })
</script>

<template>
  <td>
    <p class="font-semibold" v-html="rank"></p>
  </td>
</template>