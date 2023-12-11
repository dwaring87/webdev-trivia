<script setup>
  import MdiTable from '~icons/mdi/table-large-plus';
  import MdiDate from '~icons/mdi/calendar';
  import MdiHost from '~icons/mdi/microphone-variant';
  import MdiAccount from '~icons/mdi/account-circle';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close']);

  const { user } = useFirebase();
  const { createGame } = useGame();
  const date = ref(new Date().toISOString().split('T')[0]);
  const host = ref();
  const host_ref = ref();
  const date_required = ref(false);
  const host_required = ref(false);

  const create = () => {
    host_required.value = !host.value || host.value === '';
    date_required.value = !date.value || date.value === '';

    if ( !host_required.value && !date_required.value ) {
      createGame(date.value, host.value);
      close();
      navigateTo('/');
    }
  }
  const close = () => {
    emit('close');
  }

  watch(() => props.open, (v) => {
    if ( v ) {
      nextTick(() => {
        date.value = new Date().toISOString().split('T')[0];
        host_ref.value.focus();
      });
    }
  });

  watch(user, (v) => {
    host.value = v?.displayName;
  }, { deep: true });
</script>

<template>
  <DialogTemplate :open="open" color="green" submitLabel="Create Game" @close="close" @submit="create">
    <template #icon><MdiTable /></template>
    <template #title>Create New Game</template>
    <template #description>
      Create a new game by selecting the date and naming the host.
    </template>


    <div v-if="user">

      <!-- Date -->
      <div class="mt-4">
        <label for="email" class="label">Date:</label>
        <div class="flex-1 relative rounded-md shadow-sm mt-1">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdiDate class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input v-model="date" type="date" name="date" id="date" class="input" />
        </div>
        <p v-if="date_required && (!date || date === '')" class="required">Date is required!</p>
      </div>

      <!-- Host -->
      <div class="mt-4">
        <label for="email" class="label">Host:</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdiHost class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input v-model="host" ref="host_ref" v-on:keyup.enter="create()"
            type="text" name="host" id="host" class="input" placeholder="Name of Host" />
        </div>
        <p v-if="host_required && (!host || host === '')" class="required">Host name is required!</p>
      </div>

      <!-- Game Owner -->
      <div class="mt-4">
        <label for="owner" class="label">Owner:</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdiAccount class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input class="input" :value="`${user.displayName} <${user.email}>`" disabled />
        </div>
      </div>

    </div>

  </DialogTemplate>
</template>

<style scoped>
  .required {
    @apply text-red-600 text-sm font-semibold;
  }
</style>