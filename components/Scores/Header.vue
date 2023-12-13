<script setup>
  import MdiTeam from '~icons/mdi/account-multiple-plus';
  import MdiAccount from '~icons/mdi/account-circle';
  import MdiView from '~icons/mdi/eye-refresh';

  const props = defineProps({
    date: String,
    host: String
  });

  const { owner } = useDatabase();
  const { email } = useAuth();
  const editable = computed(() => {
    return owner.value && owner.value === email.value;
  });

  const showTeamDialog = ref(false);
</script>

<template>
  <div class="text-left sm:flex sm:items-center mt-4">
    <div class="sm:flex-auto">
      <h1 class="text-lg font-semibold leading-6 text-gray-900">Trivia Game: {{ date }}</h1>
      <p class="text-gray-700"><span class="font-semibold">Hosted By:</span> {{ host }}</p>
      <p v-if="editable" class="text-sm text-gray-700 mt-2 border-t pt-2">
        <MdiAccount class="inline mr-2" />You can <strong>edit</strong> this game.
      </p>
      <p class="text-sm text-gray-700 mt-2 border-t pt-2" v-else>
        <MdiView class="inline mr-2" />You can <strong>view</strong> this game.
      </p>
    </div>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <button @click="showTeamDialog = true" type="button" class="btn btn-green">
        <MdiTeam class="mr-2" aria-hidden="true" />
        Add Team
      </button>
    </div>
    <DialogAddTeam :open="showTeamDialog" @close="showTeamDialog = false" />
  </div>
</template>