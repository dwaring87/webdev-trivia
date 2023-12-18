<script setup>
  import MdiAlert from '~icons/mdi/alert-circle';
  import MdiLoading from '~icons/mdi/progress-download';

  const { params } = useRoute();
  const { initializing, currentGame, hasGame } = useDatabase();
  currentGame.value = `${params.user}/${params.game}`;
</script>

<template>
  <div class="container">
    <div v-if="initializing" class="my-8 flex justify-center items-center gap-x-2">
      <MdiLoading />
      <p>Loading...</p>
    </div>
    <div v-else-if="hasGame">
      <ScoresHeader />
      <ScoresTable />
    </div>
    <div v-else>
      <div class="well max-w-md mx-auto mt-8 text-center">
        <MdiAlert class="mx-auto text-2xl" />
        <p class="mt-2">Game not found!</p>
        <p class="mt-2 text-sm text-gray-500">View the <NuxtLink to="/history">table of existing games</NuxtLink> to view a past game.</p>
      </div>
    </div>
  </div>
</template>