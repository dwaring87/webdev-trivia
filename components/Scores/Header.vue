<script setup>
  import MdiTeam from '~icons/mdi/account-multiple-plus';

  const props = defineProps({
    date: String,
    host: String
  });

  const showTeamDialog = ref(false);
</script>

<template>
  <div class="text-left sm:flex sm:items-center mt-4">
    <div class="sm:flex-auto">
      <h1 class="text-base font-semibold leading-6 text-gray-900">Trivia Game: {{ date }}</h1>
      <p class="text-sm text-gray-700">Hosted By: {{ host }}</p>
    </div>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <button @click="showTeamDialog = true" type="button" class="btn btn-green">
        <MdiTeam class="mr-2" aria-hidden="true" />
        Add Team
      </button>
    </div>
    <DialogAddTeam :open="showTeamDialog" @close="showTeamDialog = false" />
  </div>
</template>