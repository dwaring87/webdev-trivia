<script setup>
  import MdiLogin from '~icons/mdi/login';
  import MdiRegister from '~icons/mdi/account-plus';
  import MdiAccount from '~icons/mdi/account-circle';
  import MdiNewGame from '~icons/mdi/table-large-plus';
  import MdiCurrentGame from '~icons/mdi/table-large';
  import MdiPastGames from '~icons/mdi/history';

  const { isLoggedIn, displayName } = useAuth();
  const { hasGame, currentGame, date, host } = useDatabase();

  const showGameDialog = ref(false);
  const showLoginDialog = ref(false);
  const showRegisterDialog = ref(false);
</script>

<template>
  <div class="container">

    <!-- NOT LOGGED IN: Show login/register -->
    <div v-if="!isLoggedIn()" class="text-center mt-14">
      <h3 class="font-semibold text-gray-900">
        <MdiAccount class="inline mr-1 -mt-1" />
        Login / Register
      </h3>
      <div class="text-sm text-gray-500">
        <p class="mt-1">
          You'll need to login to create a new game.
        </p>
        <p class="mt-4">
          You can login using an <strong>email and password</strong>, your <strong>Google account</strong>, or <strong>anonymously</strong>.
        </p>
        <p class="mt-1">
          If you want to use an <strong>email and password</strong>, you'll first need to <strong>Register</strong> to create an account.
        </p>
      </div>
      <div class="my-6 flex justify-center gap-x-4">
        <button @click="showLoginDialog = true" type="button" class="btn btn-amber">
          <MdiLogin class="mr-2" aria-hidden="true" />
          Login
        </button>
        <button @click="showRegisterDialog = true" type="button" class="btn btn-green">
          <MdiRegister class="mr-2" aria-hidden="true" />
          Register
        </button>
      </div>
    </div>

    <!-- NO GAME CREATED: Show Create Game Button -->
    <div class="text-center p-8" v-else>
      <MdiNewGame class="inline text-2xl" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900">Welcome<span v-if="displayName">, {{ displayName }}</span>!</h3>
      <p class="mt-4 text-sm text-gray-500">Get started by creating a new game!</p>
      <div class="mt-6">
        <button @click="showGameDialog = true" type="button" class="btn btn-green">
          <MdiNewGame class="mr-2" aria-hidden="true" />
          New Game
        </button>
      </div>
    </div>

    <!-- Links to Current / Past Games -->
    <div class="mt-8 flex flex-col w-fit mx-auto gap-y-4">
      <button v-if="hasGame" class="btn btn-blue" @click="navigateTo(`/game/${currentGame}`)">
        <MdiCurrentGame class="mr-2" />
        <span class='flex flex-col'>
          Return to Current Game
          <span class='text-xs opacity-60'>{{ date }} | {{ host }}</span>
        </span>
      </button>
      <button class="btn btn-blue" @click="navigateTo('/history')">
        <MdiPastGames class="mr-2" />
        View Past Games
      </button>
    </div>

    <DialogLogin :open="showLoginDialog" @close="showLoginDialog = false" />
    <DialogRegister :open="showRegisterDialog" @close="showRegisterDialog = false" />
    <DialogCreateGame :open="showGameDialog" @close="showGameDialog = false" />
  </div>
</template>