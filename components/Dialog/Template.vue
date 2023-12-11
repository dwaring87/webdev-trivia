<script setup>
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    working: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'green'
    },
    submitLabel: {
      type: String,
      default: 'Submit'
    }
  });
  const emit = defineEmits(['submit', 'close']);

  const submit = () => {
    emit('submit');
  }
  const close = () => {
    emit('close');
  }
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
                <div :class="`icon-${color} mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10`">
                  <slot name="icon"></slot>
                </div>

                <!-- Dialog Content -->
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">

                  <!-- Dialog Title -->
                  <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                    <slot name="title"></slot>
                  </DialogTitle>

                  <!-- Dialog Description -->
                  <div class="mt-2 text-sm text-gray-500">
                    <slot name="description"></slot>
                  </div>

                  <!-- Dialog Body -->
                  <slot></slot>

                </div>
              </div>

              <!-- Dialog Footer -->
              <div class="mt-5 sm:mt-8 sm:flex sm:flex-row-reverse sm:gap-x-4">
                <button type="button" :class="`btn btn-${color} mb-2`" @click="submit" :disabled="working">
                  {{ submitLabel }}
                </button>
                <button type="button" class="btn mb-2" @click="close" :disabled="working">
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
  .icon-green {
    @apply bg-emerald-700/10 text-emerald-700;
  }
  .icon-amber {
    @apply bg-amber-700/10 text-amber-700;
  }
  .icon-red {
    @apply bg-rose-800/10 text-rose-800;
  }
  .icon-blue {
    @apply bg-sky-800/10 text-sky-800;
  }
</style>