<script setup>
  const props = defineProps({
    team: String
  });

  const teams = useLocalStorage('game-teams', {});
  const total = computed(() => {
    let total = 0;
    for ( const r of [1,2,3,4,5] ) {
      const s = teams.value[props.team][`round${r}`];
      if ( s ) total = total + s;
    }
    return total === 0 ? '&mdash;' : total;
  });
</script>

<template>
  <p class="font-semibold" v-html="total"></p>
</template>