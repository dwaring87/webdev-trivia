<script setup>
  import MdiAlert from '~icons/mdi/alert-circle';

  const { params } = useRoute();
  const { currentGame } = useDatabase();
  currentGame.value = params.key;

  const { hasGame, date, host } = useDatabase();
</script>

<template>
  <div class="container">
    <div v-if="hasGame">
      <ScoresHeader :date="date" :host="host" />
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