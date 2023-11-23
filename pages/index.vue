<script setup>
  import MdiNewGame from '~icons/mdi/table-large-plus';
  import MdiPlus from '~icons/mdi/plus';
  import MdiTeam from '~icons/mdi/account-group';

  const date = useLocalStorage('game-date');
  const host = useLocalStorage('game-host');
  const teams = useLocalStorage('game-teams', {});

  const showGameDialog = ref(false);
  const showTeamDialog = ref(false);
</script>

<template>
  <div class="container">

    <div v-if="date && date !== '' && host && host !== ''">
      <div class="text-left sm:flex sm:items-center">
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
      </div>
      
      {{ teams }}

      <DialogAddTeam :open="showTeamDialog" @close="showTeamDialog = false" />
    </div>

    <div class="text-center p-8" v-else>
      <MdiNewGame class="inline text-2xl" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No Game</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new game!</p>
      <div class="mt-6">
        <button @click="showGameDialog = true" type="button" class="btn btn-green">
          <MdiPlus class="mr-2" aria-hidden="true" />
          New Game
        </button>
      </div>
      <DialogCreateGame :open="showGameDialog" @close="showGameDialog = false" />
    </div>

  </div>
</template>