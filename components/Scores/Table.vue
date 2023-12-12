<script setup>
  const { teams, setTeamSort } = useDatabase();

  const sort = ref("entry");
  const descending = ref(false);
  const toggleSort = (key) => {
    descending.value = key === sort.value ? !descending.value : descending.value;
    sort.value = key;
    setTeamSort(sort.value, descending.value);
  }

  let _sorted_teams = teams;
  const sortedTeams = computed(() => {
    if ( !editRound.value ) {
      _sorted_teams = teams.value;
    }
    return _sorted_teams;
  });

  const editRound = ref();
  const editTeam = ref();
  const edit = (round, team) => {
    editRound.value = round;
    editTeam.value = team;
  }
  const save = () => {
    editRound.value = undefined;
    editTeam.value = undefined;
  }
</script>

<template>
  <div>
    <div class="my-8 flow-root">
      <div class="-m-1 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-md md:rounded-lg">
            <table class="w-full divide-y divide-cyan-900">
              <thead class="bg-cyan-800 text-white text-center">
                <tr>
                  <TableHeader class="hidden sm:table-cell" 
                    label="Entry" sortKey="entry" :sort="sort" :descending="descending" @click="toggleSort('entry')" />
                  <TableHeader 
                    label="Team" sortKey="name" :sort="sort" :descending="descending" @click="toggleSort('name')" />
                  <TableHeader 
                    label="Rank" sortKey="rank" :sort="sort" :descending="descending" @click="toggleSort('rank')" />
                  <TableHeader class="hidden md:table-cell"
                    label="Total" sortKey="total" :sort="sort" :descending="descending" @click="toggleSort('total')" />
                  <TableHeader v-for="i in 5" :key="`round${i}`" class="hidden md:table-cell"
                    :label="`Round ${i}`" :sortKey="`round${i}`" :sort="sort" :descending="descending" @click="toggleSort(`round${i}`)" />
                  <TableHeader class="table-cell md:hidden"
                    label="Scores" sortKey="total" :sort="sort" :descending="descending" @click="toggleSort('total')" />
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white text-center text-gray-500">
                <tr v-for="(team, team_index) in sortedTeams" :key="team"
                    :class="[team_index % 2 ? 'bg-gray-100' : 'bg-white', 'hover:bg-orange-800/10']">
                  <TableEntry class="tc hidden sm:table-cell"
                    :team="team" />
                  <TableTeam class="tc text-left font-medium text-gray-900"
                    :team="team" />
                  <TableRank class="tc bg-cyan-800/20"
                    :team="team" />
                  <TableTotal class="tc bg-cyan-800/20 hidden md:table-cell"
                    :team="team" />
                  <TableScore v-for="round in 5" :key="`round-${round}`" class="tc cursor-pointer hidden md:table-cell" 
                    :team="team" :round="round" :edit="editRound === round" :focus="editRound === round && editTeam === team"
                    @click="edit(round, team)" @save="save()" />
                  <td class="tc table-cell md:hidden">
                    <table class="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th>Round</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="round in 5">
                          <td class="font-semibold">{{ round }}</td>
                          <TableScore class="cursor-pointer min-w-[60px]" 
                            :team="team" :round="round" :edit="editRound === round" :focus="editRound === round && editTeam === team"
                            @click="edit(round, team)" @save="save()" />
                        </tr>
                        <tr class="border-t-[0.1rem] border-gray-300">
                          <td class="font-bold pt-2">Total</td>
                          <TableTotal :team="team" class="font-semibold pt-2" />
                        </tr>
                      </tbody>
                    </table>
                  </td>
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
  .tc {
    @apply p-1 md:p-2 text-sm;
  }
</style>