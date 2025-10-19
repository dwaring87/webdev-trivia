<script setup>
  import GamesTable from '~/components/Games/Table.vue';
  import MdiLoading from '~icons/mdi/progress-download';
  import MdiLogin from '~icons/mdi/login';
  import MdiRegister from '~icons/mdi/account-plus';
  import MdiAccount from '~icons/mdi/account-circle';
  import MdiNewGame from '~icons/mdi/table-large-plus';
  import MdiWelcome from '~icons/mdi/hand-wave';
  import MdiRecent from '~icons/mdi/recent';

  const { initializing, isLoggedIn, displayName } = useAuth();

  const showGameDialog = ref(false);
  const showLoginDialog = ref(false);
  const showRegisterDialog = ref(false);
</script>

<template>
  <div class="container">

    <div v-if="initializing" class="my-16 flex justify-center items-center gap-x-2">
      <MdiLoading />
      <p>Loading...</p>
    </div>

    <!-- NOT LOGGED IN: Show login/register -->
    <div v-else-if="!isLoggedIn()" class="text-center mt-14">
      <h3 class="font-semibold text-gray-900">
        <MdiAccount class="inline mr-1 -mt-1" />
        Register &amp; Login
      </h3>
      <div class="text-sm text-gray-500">
        <p class="mt-1">
          You'll need to login to create a new game.
        </p>
      </div>
      <div class="my-6 flex justify-center gap-x-4">
        <button @click="showRegisterDialog = true" type="button" class="btn btn-green">
          <MdiRegister class="mr-2" aria-hidden="true" />
          Register
        </button>
        <button @click="showLoginDialog = true" type="button" class="btn btn-amber">
          <MdiLogin class="mr-2" aria-hidden="true" />
          Login
        </button>
      </div>
    </div>

    <!-- LOGGED IN: Show create game button -->
    <div class="text-center p-8" v-else>
      <h3 class="mt-2 font-semibold text-gray-900">
        <MdiWelcome class="inline mr-1 -mt-1" />
        Welcome<span v-if="displayName">, {{ displayName }}</span>!
      </h3>
      <p class="mt-4 text-sm text-gray-500">Get started by creating a new game</p>
      <div class="mt-6">
        <button @click="showGameDialog = true" type="button" class="btn btn-green">
          <MdiNewGame class="mr-2" aria-hidden="true" />
          New Game
        </button>
      </div>
    </div>

    <!-- Recent Games table -->
    <div class="max-w-xl mx-auto mt-12">
      <h3 class="text-center font-semibold text-gray-900">
        <MdiRecent class="inline mr-1 -mt-1" />
        Recent Games
      </h3>
      <GamesTable max="3" />
    </div>

    <DialogLogin :open="showLoginDialog" @close="showLoginDialog = false" />
    <DialogRegister :open="showRegisterDialog" @close="showRegisterDialog = false" />
    <DialogCreateGame :open="showGameDialog" @close="showGameDialog = false" />
  </div>
</template>