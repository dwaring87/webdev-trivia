<script setup>
  const props = defineProps({
    team: String,
    round: Number,
    edit: Boolean,
    focus: Boolean
  });
  const emit = defineEmits(['save']);

  // Get / Set score for a specific team and round
  const { editable, getScore, setScore } = useDatabase();
  const score = computed({
    get: () => {
      const s = getScore(props.team, props.round);
      return s === 0 ? 0 : (!s ? '&mdash;' : s);
    },
    set: (v) => {
      setScore(props.team, props.round, v);
    }
  });

  // Save the score values
  const save = () => {
    emit('save');
  }

  // Move input focus to the score input when focused
  const score_ref = ref();
  watch(() => props.focus, (v) => {
    if ( v ) {
      nextTick(() => {
        score_ref.value.focus();
      });
    }
  });
</script>

<template>
  <td>
    <div v-if="edit">
      <input v-model="score" v-on:keyup.enter="save()" ref="score_ref"
        class="input score-input" type="number" name="score" id="score" />
    </div>
    <p v-else :class="[editable ? 'cursor-pointer' : 'cursor-default', 'py-2']" v-html="score"></p>
  </td>
</template>

<style scoped>
  .score-input {
    @apply max-w-[60px] mx-auto px-2 py-0 border-emerald-800 bg-emerald-800/10 !important;
  }
</style>