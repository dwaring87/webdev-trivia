<script setup>
  import MdiLogin from '~icons/mdi/login';
  import MdiEmail from '~icons/mdi/email';
  import MdiPassword from '~icons/mdi/lock';
  import MdiGoogle from '~icons/mdi/google';
  import MdiGuest from '~icons/ooui/user-temporary-ltr';
  import MdiInviteCode from '~icons/mdi/lastpass';
  import { useMD5 } from '../../composables/useMD5';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close']);

  const { public:config } = useRuntimeConfig();
  const INVITE_CODE_HASH = config.invite_code_hash;

  const login_provider = ref();
  const email = ref();
  const password = ref();
  const email_required = ref(false);
  const password_required = ref(false);
  const email_ref = ref();
  const error_message = ref();
  const invitecode = ref();
  const invitecode_required = ref(false);
  const invitecode_invalid = ref(false);
  const working = ref(false);

  // Perform the provider-specific login function
  const { login, loginWithGoogle, loginAnonymously } = useAuth();
  const submit = async () => {
    error_message.value = undefined;
    let error;

    working.value = true;
    if ( login_provider.value === 'email' ) {
      error = await login_email();
    }
    else if ( login_provider.value === 'google' ) {
      error = await login_google();
    }
    else if ( login_provider.value === 'guest' ) {
      error = await login_guest();
    }
    working.value = false;

    if ( error ) {
      error_message.value = error;
    }
    else {
      close();
    }
  }

  // Perform login using email and password
  const login_email = async () => {
    email_required.value = !email.value || email.value === '';
    password_required.value = !password.value || password.value === '';
    if ( !email_required.value && !password_required.value ) {
      return await login(email.value, password.value);
    }
    else {
      return "Missing login credentials";
    }
  }

  // Perform Google login with a redirect
  const login_google = async () => {
    return await loginWithGoogle();
  }

  // Perform guest login
  const login_guest = async () => {
    invitecode_required.value = !invitecode.value || invitecode.value === '';
    if ( !!invitecode_required.value ) {
      return "Invite Code is required";
    }

    invitecode_invalid.value = useMD5(invitecode.value) !== INVITE_CODE_HASH;
    if ( !!invitecode_invalid.value ) {
      return "Invite Code is invalid";
    }

    if ( !invitecode_required.value && !invitecode_invalid.value ) {
      return await loginAnonymously();
    }
  }

  // Show the reset password dialog
  const showResetPasswordDialog = ref(false);
  const resetPassword = () => {
    close();
    showResetPasswordDialog.value = true;
  }

  // Reset the login parameters and close the dialog
  const close = () => {
    email.value = undefined;
    password.value = undefined;
    error_message.value = undefined;
    login_provider.value = undefined;
    invitecode.value = undefined;
    emit('close');
  }

  watch(login_provider, (v) => {
    nextTick(() => {
      if ( v === 'email' ) email_ref.value.focus();
    });
  });
</script>

<template>
  <div>
    <DialogTemplate :open="open" :working="working || !login_provider" color="amber" submitLabel="Login" @close="close" @submit="submit">
      <template #icon><MdiLogin /></template>
      <template #title>Login</template>

      <!-- Login Options -->
      <div v-if="!login_provider" class="mt-12 mb-4 flex flex-col gap-4 min-w-[250px]">
        <button class='btn btn-blue w-fill' @click="login_provider = 'email'">
          <MdiEmail class='mr-2 mt-0.5' />Account Login
        </button>
        <!-- <button class='btn btn-blue w-fill' @click="login_provider = 'google'">
          <MdiGoogle class='mr-2 mt-0.5' />Login with Google
        </button> -->
        <button class='btn btn-blue w-fill' @click="login_provider = 'guest'">
          <MdiGuest class='mr-2 mt-0.5' />Guest Login
        </button>
      </div>

      <!-- Email Provider -->
      <div v-else-if="login_provider === 'email'">

        <p class="description">
          Enter the <strong>email address</strong> and <strong>password</strong> of your existing account.
          If you don't already have an account, you'll need to <strong>Register</strong> to create one first.
        </p>

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
          <p class="mt-1 text-right text-xs font-bold uppercase opacity-70 hover:opacity-90 cursor-pointer" @click="resetPassword">
            Forgot Password?
          </p>
        </div>

      </div>

      <!-- Google Provider -->
      <div v-else-if="login_provider === 'google'">
        <p class="description">
          Login with your <strong>Google Account</strong>.
        </p>
        <p class="description mt-2">
          You will be redirected to Google to login with your existing Google account.  You'll be asked to grant access 
          to your Google account's name and email address to the app:<br />
          <span class='font-semibold'><code>{{ config.firebase.authDomain }}</code></span>
        </p>
      </div>

      <!-- Guest Login Provider -->
      <div v-else-if="login_provider === 'guest'">
        <p class="description">
          A <strong>guest login</strong> will allow you to create new games and edit any of your 
          previous games on this browser while you are logged in.  <strong>Once you logout, you will 
          no longer be able to edit any of your previous games</strong>.
        </p>
        <p class="description mt-4">An <strong>invite code</strong> is required for a guest login.  Ask an existing host for the 
          invite code if you don't already have it.</p>
        <div class="mt-4">
          <label for="invite-code" class="label">Invite Code:</label>
          <div class="relative mt-2 rounded-md shadow-sm">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdiInviteCode class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input v-model="invitecode" v-on:keyup.enter="submit()"
              type="text" name="invite-code" id="invite-code" class="input" placeholder="Invite Code (ask an existing host for this)" />
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error_message" class="error mt-6">
        <p>{{ error_message }}</p>
      </div>
    </DialogTemplate>
    <DialogResetPassword :open="showResetPasswordDialog" @close="showResetPasswordDialog = false" />
  </div>
</template>

<style scoped>
  .description {
    @apply text-sm text-gray-600;
  }
  .required {
    @apply text-red-600 text-sm font-semibold;
  }
</style>