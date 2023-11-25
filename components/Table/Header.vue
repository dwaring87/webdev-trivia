<script setup>
  import MdiCheck from '~icons/mdi/check-bold';

  const props = defineProps({
    round: Number,
    edit: Boolean
  });
  const emit = defineEmits(['save', 'edit']);

  const save = () => {
    emit('save');
  }
  const startEdit = () => {
    emit('edit');
  }
</script>

<template>
  <div class="cursor-pointer">
    <div v-if="edit" class="bg-zinc-800 text-white py-1 rounded-md" @click="save">
      <p><MdiCheck class="inline mr-2 mb-1" />Save</p>
    </div>
    <div v-else class="py-1" @click="startEdit">
      <p>Round {{ round }}</p>
    </div>
  </div>
</template>