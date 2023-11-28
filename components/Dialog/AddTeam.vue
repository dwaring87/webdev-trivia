<script setup>
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
  import MdiTeam from '~icons/mdi/account-group';
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
                  <MdiTeam class="h-6 w-6 text-emerald-700" aria-hidden="true" />
                </div>

                <!-- Dialog Content -->
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">

                  <!-- Dialog Title -->
                  <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                    Add Team
                  </DialogTitle>

                  <!-- Dialog Body -->
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Enter the name of the team to add to the game.
                    </p>
                  </div>

                  <div class="mt-2">

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
                  </div>

                </div>
              </div>

              <!-- Dialog Footer -->
              <div class="mt-5 sm:mt-8 sm:flex sm:flex-row-reverse sm:gap-x-4">
                <button type="button" class="btn btn-green" @click="add">
                  Add Team
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
  .required {
    @apply text-red-600 text-sm font-semibold;
  }
</style>