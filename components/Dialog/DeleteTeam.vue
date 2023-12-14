<script setup>
  import MdiDelete from '~icons/mdi/delete';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    team: String
  });
  const emit = defineEmits(['close']);

  const { removeTeam } = useDatabase();
  const submit = () => {
    removeTeam(props.team);
    close();
  }
  const close = () => {
    emit('close');
  }
</script>

<template>
  <DialogTemplate :open="open" color="red" submitLabel="Delete Team" @close="close" @submit="submit">
    <template #icon><MdiDelete /></template>
    <template #title>Delete Team?</template>
    <template #description>
      Are you sure you want to delete <span class="font-bold text-rose-800">{{ team }}</span> from the current game?  
      <strong>This will remove all of their scores!</strong>
    </template>
  </DialogTemplate>
</template>