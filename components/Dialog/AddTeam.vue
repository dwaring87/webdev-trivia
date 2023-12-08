<script setup>
  import MdiTeam from '~icons/mdi/account-multiple-plus';
  import MdiEntry from '~icons/mdi/pound-box-outline';
  import MdiName from '~icons/mdi/rename-box-outline';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close']);

  const { scores, nextEntry, addTeam } = useGame();
  const entry = ref();
  const name = ref();
  const name_ref = ref();
  const entry_required = ref(false);
  const name_required = ref(false);
  const name_exists = ref(false);

  const add = () => {
    entry_required.value = !entry.value || entry.value === '';
    name_required.value = !name.value || name.value === '';
    name_exists.value = Object.keys(scores.value).includes(name.value);

    if ( !entry_required.value && !name_required.value && !name_exists.value ) {
      addTeam(entry.value, name.value);
      name.value = undefined;
      close();
    }
  }
  const close = () => {
    emit('close');
  }

  watch(() => props.open, (v) => {
    if ( v ) {
      nextTick(() => {
        entry.value = nextEntry();
        name_exists.value = false;
        name_required.value = false;
        name_ref.value.focus();
      });
    }
  });
</script>

<template>
  <DialogTemplate :open="open" color="green" submitLabel="Add Team" @close="close" @submit="add">
    <template #icon><MdiTeam /></template>
    <template #title>Add Team</template>
    <template #description>Enter the name of the team to add to the game.</template>

    <!-- Entry -->
    <div class="mt-4">
      <label for="email" class="label">Entry:</label>
      <div class="flex-1 relative rounded-md shadow-sm mt-2">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MdiEntry class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input v-model="entry" type="number" name="entry" id="entry" class="input" />
      </div>
      <p v-if="entry_required && (!entry || entry === '')" class="required">Entry number is required!</p>
    </div>

    <!-- Name -->
    <div class="mt-4">
      <label for="email" class="label">Name:</label>
      <div class="relative mt-2 rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MdiName class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input v-model="name" ref="name_ref" v-on:keyup.enter="add()"
          type="text" name="name" id="name" class="input" placeholder="Name of Team" />
      </div>
      <p v-if="name_required && (!name || name === '')" class="required">Team name is required!</p>
      <p v-if="name_exists" class="required">Team name already exists!</p>
    </div>

  </DialogTemplate>
</template>

<style scoped>
  .required {
    @apply text-red-600 text-sm font-semibold;
  }
</style>