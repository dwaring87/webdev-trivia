<script setup>
  import MdiAccount from '~icons/mdi/account-circle';
  import MdiNext from '~icons/mdi/chevron-right';

  const { getGames } = useDatabase();
  const { id } = useAuth();

  const games = ref([]);
  games.value = await getGames();
  const sortedGames = computed(() => {
    let s = games.value || [];
    s = s.sort((a, b) => {
      return a[sort.value] < b[sort.value] ? (descending.value ? 1 : -1) 
        : a[sort.value] > b[sort.value] ? (descending.value ? -1 : 1) 
        : 0;
    });
    return s;
  });

  const sort = ref('date');
  const descending = ref(true);
  const toggleSort = async (key) => {
    descending.value = key === sort.value ? !descending.value : descending.value;
    sort.value = key;
    games.value = await getGames();
  }

  const loadGame = (key) => {
    navigateTo(`/game/${key}`);
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
                  <th class="hidden md:table-cell"></th>
                  <TableHeader
                    label="Date" sortKey="date" :sort="sort" :descending="descending" @click="toggleSort('date')" />
                  <TableHeader 
                    label="Host" sortKey="host" :sort="sort" :descending="descending" @click="toggleSort('host')" />
                  <TableHeader 
                    label="Teams" sortKey="teams" :sort="sort" :descending="descending" @click="toggleSort('teams')" />
                  <TableHeader
                    label="Winner" sortKey="winner" :sort="sort" :descending="descending" @click="toggleSort('winner')" />
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white text-center text-gray-500">
                <tr v-for="(game, game_index) in sortedGames" :key="game_index"
                    :class="[
                      game_index % 2 ? 'bg-gray-100' : 'bg-white',
                      id && game.owner === id ? 'font-semibold' : 'font-normal',
                      'hover:bg-orange-800/10 cursor-pointer'
                    ]"
                    @click="loadGame(game.key)">
                  <td class="tc hidden md:table-cell"><p><MdiAccount v-if="id && game.owner === id" class="mx-auto text-emerald-700" /></p></td>
                  <td class="tc"><p>{{ game.date }}</p></td>
                  <td class="tc">{{ game.host }}</td>
                  <td class="tc">{{ game.teams }}</td>
                  <td class="tc flex justify-between">
                    <p></p>
                    <p>{{ game.winner }}</p>
                    <MdiNext class="mr-2" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
  .tc {
    @apply py-1 sm:py-2 md:py-4;
  }
</style>