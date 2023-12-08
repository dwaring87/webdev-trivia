<script setup>
  import MdiClear from '~icons/mdi/eraser';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close']);

  const { clearScores } = useGame();

  const clear = () => {
    clearScores();
    close();
  }
  const close = () => {
    emit('close');
  }
</script>

<template>
  <DialogTemplate :open="open" color="amber" submitLabel="Clear Scores" @close="close" @submit="clear">
    <template #icon><MdiClear /></template>
    <template #title>Clear Scores?</template>
    <template #description>Are you sure you want to <strong>delete all of the scores</strong> from the current game?</template>
  </DialogTemplate>
</template>