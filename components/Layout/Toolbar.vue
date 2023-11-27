<script setup>
  import MdiNewGame from '~icons/mdi/table-large-plus';
  import MdiDeleteGame from '~icons/mdi/delete';

  const showCreateDialog = ref(false);
  const showDeleteDialog = ref(false);
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
            <button class='btn btn-white' @click="showCreateDialog = true">
              <MdiNewGame class="inline sm:mr-2" />
              <span class="hidden sm:inline">New Game</span>
            </button>
            <button class='btn btn-red' @click="showDeleteDialog = true">
              <MdiDeleteGame class="inline sm:mr-2" />
              <span class="hidden sm:inline">Delete Game</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
    <DialogCreateGame :open="showCreateDialog" @close="showCreateDialog = false" />
    <DialogDeleteGame :open="showDeleteDialog" @close="showDeleteDialog = false" />
  </div>
</template>