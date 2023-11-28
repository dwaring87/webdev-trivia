<script setup>
  import MdiCheck from '~icons/mdi/check-bold';

  const props = defineProps({
    editRound: Number
  });
  const emit = defineEmits(['hide']);
  const hide = () => {
    emit('hide');
  }
</script>

<template>
  <div aria-live="assertive" class="pointer-events-none fixed top-16 inset-x-0 mx-auto w-full flex items-end px-4">
    <div class="flex w-full flex-col items-center space-y-4">
      <transition 
          enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" 
          leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="!!editRound" class="pointer-events-auto flex w-full max-w-md rounded-lg bg-white border-2 border-emerald-800 shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="w-0 flex-1 p-4 bg-lime-600/20">
            <div class="flex items-start">
              <div class="ml-3 w-0 flex-1">
                <p class="text-sm font-medium text-emerald-900">Editing Round {{ editRound }}</p>
              </div>
            </div>
          </div>
          <div class="flex border-l border-l-2 border-emerald-800/20 bg-lime-600/20">
            <button type="button" @click="hide" class="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-emerald-700 hover:text-emerald-800 focus:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-700 ring-inset">
              <MdiCheck class="inline mr-2" />Save
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>