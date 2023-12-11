<script setup>
  import MdiDelete from '~icons/mdi/delete';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close']);

  const { clearGame } = useGame();
  const submit = () => {
    clearGame();
    close();
  }
  const close = () => {
    emit('close');
  }
</script>

<template>
  <DialogTemplate :open="open" color="red" submitLabel="Delete Game" @close="close" @submit="submit">
    <template #icon><MdiDelete /></template>
    <template #title>Delete Game?</template>
    <template #description>
      Are you sure you want to delete the current game?  
      <strong>This will remove all of the teams and their scores!</strong>
    </template>
  </DialogTemplate>
</template>