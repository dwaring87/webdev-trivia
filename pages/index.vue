<script setup>
  import MdiNewGame from '~icons/mdi/table-large-plus';
  import MdiPlus from '~icons/mdi/plus';
  import MdiTeam from '~icons/mdi/account-group';

  const date = useLocalStorage('game-date');
  const host = useLocalStorage('game-host');
  const teams = useLocalStorage('game-teams', {});

  const showGameDialog = ref(false);
  const showTeamDialog = ref(false);
  const editRound = ref(false);
</script>

<template>
  <div class="container">

    <!-- Game Info / Add Team -->
    <div v-if="date && date !== '' && date !== 'undefined' && host && host !== '' && host !== 'undefined'">
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
      </div>

      <!-- Score Table -->
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-amber-700 text-white text-center">
                  <tr>
                    <th scope="col" class="table-header">Entry</th>
                    <th scope="col" class="table-header text-left">Team</th>
                    <th scope="col" class="table-header">Rank</th>
                    <th scope="col" class="table-header">Total</th>
                    <th v-for="i in 5" scope="col" class="table-header" :key="i">
                      <TableHeader :round="i" :edit="editRound === i" @save="editRound = undefined" @edit="editRound = i" />
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white text-center text-gray-500">
                  <tr v-for="[index, [team, props]] of Object.entries(Object.entries(teams))" :key="team"
                      :class="[index % 2 ? 'bg-gray-100' : 'bg-white', 'hover:bg-amber-700/10']">
                    <td class="table-cell">{{ props.entry}}</td>
                    <td class="table-cell text-left font-medium text-gray-900">{{ team }}</td>
                    <td class="table-cell bg-amber-700/20">
                      <TableRank :team="team" />
                    </td>
                    <td class="table-cell bg-amber-700/20">
                      <TableTotal :team="team" />
                    </td>
                    <td v-for="i in 5" class="table-cell cursor-pointer" @click="editRound = i" :key="i">
                      <TableScore :team="team" :round="i" :edit="editRound === i" @save="editRound = undefined" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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

<style scoped>
  .table-header {
    @apply px-3 py-3.5 text-sm font-semibold;
  }
  .table-cell {
    @apply whitespace-nowrap px-2 py-2 text-sm;
  }
</style>