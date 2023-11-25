<script setup>
  const props = defineProps({
    team: String
  });

  const teams = useLocalStorage('game-teams', {});
  const rank = computed(() => {
    let totals = [];
    let team_total = 0;
    for ( const t in teams.value ) {
      let total = 0;
      for ( const r of [1,2,3,4,5] ) {
        const s = parseFloat(teams.value[t][`round${r}`]);
        if ( s ) total = total + s;
      }
      if ( props.team === t ) team_total = total;
      totals.push(total);
    }
    const unique = [...new Set(totals)];
    const sorted = unique.sort((a, b) => b - a);
    const team_rank = sorted.indexOf(team_total) + 1;

    return team_total === 0 ? '&mdash;' : team_rank;
  });
</script>

<template>
  <p class="font-semibold" v-html="rank"></p>
</template>