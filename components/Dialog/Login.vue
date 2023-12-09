<script setup>
  import MdiLogin from '~icons/mdi/login';
  import MdiEmail from '~icons/mdi/email';
  import MdiPassword from '~icons/mdi/lock';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close']);

  const email = ref();
  const password = ref();
  const email_required = ref(false);
  const password_required = ref(false);

  const login = () => {
    email_required.value = !email.value || email.value === '';
    password_required.value = !password.value || password.value === '';

    if ( !email_required.value && !password_required.value ) {
      
    }
  }
  const close = () => {
    emit('close');
  }
</script>

<template>
  <DialogTemplate :open="open" color="amber" submitLabel="Login" @close="close" @submit="login">
    <template #icon><MdiLogin /></template>
    <template #title>Login</template>
    <template #description>Enter your email address and password to login to your existing account.</template>

    <!-- Email -->
    <div class="mt-4">
      <label for="email" class="label">Email:</label>
      <div class="relative mt-2 rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MdiEmail class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input v-model="email" v-on:keyup.enter="login()"
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
        <input v-model="password" v-on:keyup.enter="login()"
          type="password" name="password" id="password" class="input" placeholder="Your Strong Password" />
      </div>
      <p v-if="password_required && (!password || password === '')" class="required">Your password is required!</p>
    </div>

  </DialogTemplate>
</template>

<style scoped>
  .required {
    @apply text-red-600 text-sm font-semibold;
  }
</style>