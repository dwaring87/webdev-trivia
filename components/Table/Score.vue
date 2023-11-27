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
        class="input" type="number" name="score" id="score" />
    </div>
    <p v-else class="py-2" v-html="!! score ? score : '&mdash;'"></p>
  </div>
</template>

<style scoped>
  .input {
    @apply w-[60px] bg-zinc-800/20 border border-zinc-800 text-gray-900 px-2 py-1 rounded-md;
  }
</style>