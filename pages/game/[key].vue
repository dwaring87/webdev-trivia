<script setup>
  const { params } = useRoute();
  const currentGame = useLocalStorage('current-game');
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
      <p>Game not found!</p>
    </div>
  </div>
</template>