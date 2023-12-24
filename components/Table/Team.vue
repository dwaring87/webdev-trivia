<script setup>
  const props = defineProps({
    team: String,
    edit: Boolean,
    focus: Boolean
  });
  const emit = defineEmits(['save']);

  // Team name to display / edit
  const name = ref(props.team);

  // Finish Updating
  const save = () => {
    emit('save');
  }

  // Watch for name changes and update the team name
  const { updateTeamName } = useDatabase();
  const watchTeamName = (e) => {
    updateTeamName(props.team, e.target.value);
  }

  // Move input focus to the score input when focused
  const team_ref = ref();
  watch(() => props.focus, (v) => {
    if ( v ) {
      nextTick(() => {
        team_ref.value.focus();
      });
    }
  });
</script>

<template>
  <td>
    <div v-if="edit">
      <input v-model="name" ref="team_ref"
        class="input team-input" type="text" name="team" id="team" />
    </div>
    <p v-else class="py-2 min-w-[100px]">{{ team }}</p>
  </td>
</template>

<style scoped>
  .team-input {
    @apply min-w-[100px] mx-auto px-2 py-0 border-emerald-800 bg-emerald-800/10 !important;
  }
</style>