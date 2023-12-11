<script setup>
  import MdiLogin from '~icons/mdi/login';
  import MdiEmail from '~icons/mdi/email';
  import MdiPassword from '~icons/mdi/lock';
  import MdiGoogle from '~icons/mdi/google';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close']);

  const login_provider = ref();
  const email = ref();
  const password = ref();
  const email_required = ref(false);
  const password_required = ref(false);
  const email_ref = ref();
  const error_message = ref();
  const working = ref(false);

  const { login, loginWithGoogle } = useFirebase();
  const submit = async () => {
    working.value = true;
    error_message.value = undefined;
    email_required.value = !email.value || email.value === '';
    password_required.value = !password.value || password.value === '';

    if ( !email_required.value && !password_required.value ) {
      const { error, user } = await login(email.value, password.value);
      if ( error || !user ) {
        error_message.value = (error || "Could not login").replace("Firebase: ", "");
      }
      else {
        close();
      }
    }
    working.value = false;
  }
  const login_google = async () => {
    working.value = true;
    const { error } = await loginWithGoogle();
    if ( error ) {
      error_message.value = error.replace("Firebase: ", "");
    }
    else {
      close();
    }
  }
  const close = () => {
    email.value = undefined;
    password.value = undefined;
    error_message.value = undefined;
    login_provider.value = undefined;
    emit('close');
  }

  watch(login_provider, (v) => {
    nextTick(() => {
      if ( v === 'email' ) email_ref.value.focus();
    });
  });
</script>

<template>
  <DialogTemplate :open="open" :working="working || !login_provider" color="amber" submitLabel="Login" @close="close" @submit="submit">
    <template #icon><MdiLogin /></template>
    <template #title>Login</template>
    <template #description>
      <span v-if="!login_provider">Choose a way to log in</span>
      <span v-else-if="login_provider === 'email'">Enter your email address and password to login to your existing account.</span>
    </template>

    <!-- Login Options -->
    <div v-if="!login_provider" class="mt-4 flex flex-col gap-4">
      <button class='btn btn-blue' @click="login_provider = 'email'">
        <MdiEmail class='mr-2' />Login with Email &amp; Password
      </button>
      <button class='btn btn-blue' @click="login_google">
        <MdiGoogle class='mr-2' />Login with Google
      </button>
    </div>

    <!-- Email Provider -->
    <div v-else-if="login_provider === 'email'">

      <!-- Email -->
      <div class="mt-4">
        <label for="email" class="label">Email:</label>
        <div class="relative mt-2 rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdiEmail class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input v-model="email" ref="email_ref" v-on:keyup.enter="submit()"
            type="email" name="email" id="email" class="input" placeholder="Your Email Address" />
        </div>
        <p v-if="email_required && (!email || email === '')" class="required">Your email address is required!</p>
      </div>

      <!-- Password -->
      <div class="mt-4">
        <label for="password" class="label">Password:</label>
        <div class="relative mt-2 rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdiPassword class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input v-model="password" v-on:keyup.enter="submit()"
            type="password" name="password" id="password" class="input" placeholder="Your Strong Password" />
        </div>
        <p v-if="password_required && (!password || password === '')" class="required">Your password is required!</p>
      </div>

    </div>

    <div v-if="error_message" class="error mt-6">
      <p>{{ error_message }}</p>
    </div>

  </DialogTemplate>
</template>

<style scoped>
  .required {
    @apply text-red-600 text-sm font-semibold;
  }
</style>