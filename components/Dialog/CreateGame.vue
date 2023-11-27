<script setup>
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
  import MdiTable from '~icons/mdi/table-large-plus';
  import MdiDate from '~icons/mdi/calendar';
  import MdiHost from '~icons/mdi/microphone-variant';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close']);

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
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="close">

      <!-- Background Shade -->
      <TransitionChild as="div"
          enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

          <TransitionChild as="div"
              enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

            <!-- Dialog Panel -->
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="sm:flex sm:items-start">

                <!-- Dialog Icon -->
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-700/10 sm:mx-0 sm:h-10 sm:w-10">
                  <MdiTable class="h-6 w-6 text-emerald-700" aria-hidden="true" />
                </div>

                <!-- Dialog Content -->
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">

                  <!-- Dialog Title -->
                  <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                    Create New Game
                  </DialogTitle>

                  <!-- Dialog Body -->
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Create a new game by selecting the date and naming the host.
                      <span class="font-semibold">This will clear any existing scores.</span>
                    </p>
                  </div>

                  <div class="mt-2">

                    <!-- Date -->
                    <div class="mt-4">
                      <label for="email" class="label">Date:</label>
                      <div class="flex-1 relative rounded-md shadow-sm mt-2">
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
                      <div class="relative mt-2 rounded-md shadow-sm">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MdiHost class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input v-model="host" ref="host_ref" v-on:keyup.enter="create()"
                          type="text" name="host" id="host" class="input" placeholder="Name of Host" />
                      </div>
                      <p v-if="host_required && (!host || host === '')" class="required">Host name is required!</p>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Dialog Footer -->
              <div class="mt-5 sm:mt-8 sm:flex sm:flex-row-reverse sm:gap-x-4">
                <button type="button" class="btn btn-green" @click="create">
                  Create Game
                </button>
                <button type="button" class="btn" @click="close">
                  Cancel
                </button>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
  .label {
    @apply block text-sm font-medium leading-6 text-gray-900;
  }
  .input {
    @apply block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6;
  }
  .required {
    @apply text-red-600 text-sm font-semibold;
  }
</style>