<script setup>
  const props = defineProps({
    team: String,
    round: Number,
    edit: Boolean
  });
  const emit = defineEmits(['save']);

  const { scores } = useGame();
  const score = computed({
    get: () => {
      return scores.value[props.team][`round${props.round}`];
    },
    set: (v) => {
      scores.value[props.team][`round${props.round}`] = !!v ? v : false;
    }
  });

  const save = () => {
    emit('save');
  }
</script>

<template>
  <div>
    <div v-if="edit">
      <input v-model="score" v-on:keyup.enter="save()"
        class="input score-input" type="number" name="score" id="score" />
    </div>
    <p v-else class="py-2" v-html="!! score ? score : '&mdash;'"></p>
  </div>
</template>

<style scoped>
  .score-input {
    @apply max-w-[60px] mx-auto px-2 py-0 border-emerald-800 bg-emerald-800/10 !important;
  }
</style>