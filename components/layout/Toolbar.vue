<script setup>
  import MdiNewGame from '~icons/mdi/table-large-plus';

  const showDialog = ref(false);
</script>

<template>
  <div>
    <nav class="bg-zinc-800 text-white shadow-md">
      <div class="container">
        <div class="h-14 flex justify-between items-center">
          <div class="flex items-center">
            <p class="font-semibold">Atlas QuizBowl</p>
          </div>
          <div class="flex-grow"></div>
          <div class="flex gap-2 lg:gap-4">
            <NuxtLink to="#" @click="showDialog = true"><MdiNewGame class="inline sm:mr-2" />
              <span class="hidden sm:inline">New Game</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
    <DialogCreateGame :open="showDialog" @close="showDialog = false" />
  </div>
</template>