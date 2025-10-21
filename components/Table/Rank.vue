<script setup>
  import IcWinner from '~icons/mdi/crown';

  const props = defineProps({
    team: String
  });

  const { teamScores } = useDatabase();
  const rank = computed(() => {
    const r = teamScores(props.team)?.rank;
    return !!r ? r : '&mdash;';
  });
  const isWinner = computed(() => {
    return teamScores(props.team)?.is_winner;
  })
</script>

<template>
  <td>
    <IcWinner class="inline text-amber-600 text-xl" v-if="isWinner" />
    <p class="font-semibold" v-html="rank" v-else></p>
  </td>
</template>