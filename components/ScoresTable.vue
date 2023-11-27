<script setup>
  const { teams } = useGame();
  const editRound = ref(false);
</script>

<template>
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
                  <TableHeader :round="i" />
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white text-center text-gray-500">
              <tr v-for="(team, index) in teams" :key="team"
                  :class="[index % 2 ? 'bg-gray-100' : 'bg-white', 'hover:bg-amber-700/10']">
                <TableEntry class="tale-cell" :team="team" />
                <TableTeam class="table-cell text-left font-medium text-gray-900" :team="team" />
                <TableRank class="table-cell bg-amber-700/20" :team="team" />
                <TableTotal class="table-cell bg-amber-700/20" :team="team" />
                <TableScore v-for="i in 5" :key="`round-${i}`" class="table-cell cursor-pointer" 
                  :team="team" :round="i" :edit="editRound === i" 
                  @click="editRound = i" @save="editRound = undefined" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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