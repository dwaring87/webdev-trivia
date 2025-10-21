<script setup>
  import MdiOff from '~icons/mdi/checkbox-blank-outline';
  import MdiOn from '~icons/mdi/checkbox-marked'
  const { editable, teamScores, setTieBreaker } = useDatabase();

  const props = defineProps({
    team: String
  });

  const isInTieBreaker = computed(() => {
    return teamScores(props.team)?.in_tiebreaker;
  });

  const wonTieBreaker = computed(() => {
    return teamScores(props.team)?.won_tiebreaker;
  })

  const toggleTieBreaker = () => {
    if ( editable.value ) {
      setTieBreaker(props.team, !teamScores(props.team).won_tiebreaker);
    }
  }
</script>

<template>
  <td class="mx-auto">
    <div v-if="isInTieBreaker" @click="toggleTieBreaker" :class="['mx-auto opacity-80 hover:opacity-100', editable ? 'cursor-pointer' : 'cursor-not-allowed']">
      <MdiOn v-if="wonTieBreaker" class="inline" />
      <MdiOff v-else class="inline" />
    </div>
 </td>
</template>