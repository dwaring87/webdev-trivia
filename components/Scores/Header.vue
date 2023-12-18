<script setup>
  import MdiTeam from '~icons/mdi/account-multiple-plus';
  import MdiAccount from '~icons/mdi/account-circle';
  import MdiView from '~icons/mdi/eye-refresh';

  const { editable, date, rounds, host } = useDatabase();
  const showTeamDialog = ref(false);
</script>

<template>
  <div class="text-left sm:flex sm:items-center mt-4">
    <div class="sm:flex-auto">
      <p class="text-lg font-semibold leading-6 text-gray-900">Trivia Game: {{ date }}</p>
      <p class="text-gray-700"><span class="font-semibold">Hosted By:</span> {{ host }}</p>
      <p class="text-gray-700"><span class="font-semibold">Rounds:</span> {{ rounds }}</p>
      <p v-if="editable" class="text-sm text-gray-700 mt-2 border-t pt-2">
        <MdiAccount class="inline mr-2" />You can <strong>edit</strong> this game.
      </p>
      <p class="text-sm text-gray-700 mt-2 border-t pt-2" v-else>
        <MdiView class="inline mr-2" />You can <strong>view</strong> this game.
      </p>
    </div>
    <div v-if="editable" class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <button @click="showTeamDialog = true" type="button" class="btn btn-green">
        <MdiTeam class="mr-2" aria-hidden="true" />
        Add Team
      </button>
    </div>
    <DialogAddTeam :open="showTeamDialog" @close="showTeamDialog = false" />
  </div>
</template>