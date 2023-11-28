<script setup>
  const { teams } = useGame();
  const editRound = ref();

  const sort = ref("entry");
  const descending = ref(false);
  const toggleSort = (key) => {
    descending.value = key === sort.value ? !descending.value : descending.value;
    sort.value = key;
  }

  let _sorted_teams = [];
  const sortedTeams = computed(() => {
    if ( !editRound.value ) {
      _sorted_teams = teams(sort.value, descending.value);
    }
    return _sorted_teams;
  });
</script>

<template>
  <div>
    <div class="my-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-amber-700 text-white text-center">
                <tr>
                  <TableHeader label="Entry" sortKey="entry" :sort="sort" :descending="descending" @click="toggleSort('entry')" />
                  <TableHeader class="text-left" label="Team" sortKey="name" :sort="sort" :descending="descending" @click="toggleSort('name')" />
                  <TableHeader label="Rank" sortKey="rank" :sort="sort" :descending="descending" @click="toggleSort('rank')" />
                  <TableHeader label="Total" sortKey="total" :sort="sort" :descending="descending" @click="toggleSort('total')" />
                  <TableHeader v-for="i in 5" :key="`round${i}`" @click="toggleSort(`round${i}`)"
                    :label="`Round ${i}`" :sortKey="`round${i}`" :sort="sort" :descending="descending" />
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white text-center text-gray-500">
                <tr v-for="(team, index) in sortedTeams" :key="team"
                    :class="[index % 2 ? 'bg-gray-100' : 'bg-white', 'hover:bg-amber-700/10']">
                  <TableEntry class="table-cell" :team="team" />
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
    <TableSave :editRound="editRound" @hide="editRound = undefined" />
  </div>
</template>


<style scoped>
  .table-cell {
    @apply whitespace-nowrap px-2 py-2 text-sm;
  }
</style>