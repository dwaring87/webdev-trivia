<script setup>
  import MdiLogin from '~icons/mdi/login';
  import MdiRegister from '~icons/mdi/account-plus';
  import MdiAccount from '~icons/mdi/account-circle';
  import MdiNewGame from '~icons/mdi/table-large-plus';
  import MdiPlus from '~icons/mdi/plus';

  const { isLoggedIn, displayName } = useAuth();
  const { hasGame, date, host } = useDatabase();
  const showGameDialog = ref(false);
  const showLoginDialog = ref(false);
  const showRegisterDialog = ref(false);
</script>

<template>
  <div class="container">

    <!-- NOT LOGGED IN: Show login/register -->
    <div v-if="!isLoggedIn()" class="text-center p-8">
      <MdiAccount class="inline text-2xl" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900">Login / Register</h3>
      <p class="mt-1 text-sm text-gray-500">You'll need to login to create a new game.</p>
      <p class="mt-4 text-sm text-gray-500">
        You can create an account using an <strong>email and password</strong> 
        or login using your <strong>Google account</strong>.
      </p>
      <div class="mt-6 flex justify-center gap-x-4">
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

    <!-- GAME CREATED: Show Table -->
    <div v-else-if="hasGame">
      <ScoresHeader :date="date" :host="host" />
      <ScoresTable />
    </div>

    <!-- NO GAME CREATED: Show Create Game Button -->
    <div class="text-center p-8" v-else>
      <MdiNewGame class="inline text-2xl" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900">Welcome<span v-if="displayName">, {{ displayName }}</span>!</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new game!</p>
      <div class="mt-6">
        <button @click="showGameDialog = true" type="button" class="btn btn-green">
          <MdiPlus class="mr-2" aria-hidden="true" />
          New Game
        </button>
      </div>
    </div>

    <DialogLogin :open="showLoginDialog" @close="showLoginDialog = false" />
    <DialogRegister :open="showRegisterDialog" @close="showRegisterDialog = false" />
    <DialogCreateGame :open="showGameDialog" @close="showGameDialog = false" />
  </div>
</template>