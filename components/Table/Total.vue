<script setup>
  const props = defineProps({
    team: String
  });

  const { teamScores } = useDatabase();
  const total = computed(() => {
    const t = teamScores(props.team).total;
    return !!t ? t : '&mdash;';
  })
</script>

<template>
  <td>
    <p class="font-semibold" v-html="total"></p>
  </td>
</template>