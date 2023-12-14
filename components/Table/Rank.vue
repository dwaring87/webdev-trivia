<script setup>
  const props = defineProps({
    team: String
  });

  const { teamScores } = useDatabase();
  const rank = computed(() => {
    const r = teamScores(props.team).rank;
    return !!r ? r : '&mdash;';
  });
</script>

<template>
  <td>
    <p class="font-semibold" v-html="rank"></p>
  </td>
</template>