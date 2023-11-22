<script setup>
  const game = useLocalStorage('game');
</script>

<template>
  <div class="container">
    <h1>Home Page</h1>
    <p>Game:</p>
    {{ game }}
  </div>
</template>