<script setup>
  import MdiTable from '~icons/mdi/table-large-plus';
  import MdiDate from '~icons/mdi/calendar';
  import MdiRounds from '~icons/mdi/pound-box';
  import MdiHost from '~icons/mdi/microphone-variant';
  import MdiAccount from '~icons/mdi/account-circle';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close']);

  const { public:config } = useRuntimeConfig();
  const { isLoggedIn, email, displayName } = useAuth();
  const date = ref();
  const rounds = ref(parseInt(config.rounds));
  const host = ref();
  const owner = ref();
  const host_ref = ref();
  const date_required = ref(false);
  const host_required = ref(false);

  const { createGame } = useDatabase();
  const submit = async () => {
    host_required.value = !host.value || host.value === '';
    date_required.value = !date.value || date.value === '';
    if ( !host_required.value && !date_required.value ) {
      const key = await createGame(date.value, rounds.value, host.value);
      close();
      navigateTo(`/game/${key}`);
    }
  }
  const close = () => {
    emit('close');
  }

  watch(() => props.open, (v) => {
    if ( v ) {
      nextTick(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        date.value = `${y}-${m}-${d}`;
        host.value = displayName.value;
        owner.value = displayName.value ? `${displayName.value} <${email.value}>` : email.value;
        host_ref.value.focus();
      });
    }
  });
</script>

<template>
  <DialogTemplate :open="open" color="green" submitLabel="Create Game" @close="close" @submit="submit">
    <template #icon><MdiTable /></template>
    <template #title>Create New Game</template>
    <template #description>
      Create a new game by selecting the date and naming the host.
    </template>

    <div v-if="isLoggedIn()">

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

      <!-- Rounds -->
      <div class="mt-4">
        <label for="rounds" class="label">Rounds:</label>
        <div class="flex-1 relative rounded-md shadow-sm mt-1">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdiRounds class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input v-model="rounds" type="number" name="rounds" id="rounds" min="1" class="input" />
        </div>
      </div>

      <!-- Host -->
      <div class="mt-4">
        <label for="email" class="label">Host:</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdiHost class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input v-model="host" ref="host_ref" v-on:keyup.enter="submit()"
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
          <input v-model="owner" type="text" name="owner" id="owner" class="input" disabled />
        </div>
      </div>

    </div>

    <div v-else>
      <p>You must <strong>login</strong> to create a game</p>
    </div>
  </DialogTemplate>
</template>

<style scoped>
  .required {
    @apply text-red-600 text-sm font-semibold;
  }
</style>