<script setup>
  import MdiRegister from '~icons/mdi/account-plus';
  import MdiName from '~icons/mdi/microphone-variant';
  import MdiEmail from '~icons/mdi/email';
  import MdiPassword from '~icons/mdi/lock';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close']);

  const name = ref();
  const email = ref();
  const password = ref();
  const name_required = ref(false);
  const email_required = ref(false);
  const password_required = ref(false);
  const error_message = ref();
  const working = ref(false);

  const { register } = useAuth();
  const submit = async () => {
    working.value = true;
    error_message.value = undefined;
    name_required.value = !name.value || name.value === '';
    email_required.value = !email.value || email.value === '';
    password_required.value = !password.value || password.value === '';

    if ( !name_required.value && !email_required.value && !password_required.value ) {
      const { error, user } = await register(name.value, email.value, password.value);
      if ( error || !user ) {
        error_message.value = (error || "Could not register new account").replace("Firebase: ", "");
      }
      else {
        close();
      }
    }
    working.value = false;
  }
  const close = () => {
    name.value = undefined;
    email.value = undefined;
    password.value = undefined;
    error_message.value = undefined;
    emit('close');
  }
</script>

<template>
  <DialogTemplate :open="open" :working="working" color="green" submitLabel="Register" @close="close" @submit="submit">
    <template #icon><MdiRegister /></template>
    <template #title>Register Account</template>
    <template #description>Enter your name, email address, and password to create a new account.</template>

    <!-- Name -->
    <div class="mt-4">
      <label for="name" class="label">Name:</label>
      <div class="relative mt-2 rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MdiName class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input v-model="name" v-on:keyup.enter="submit()"
          type="text" name="name" id="name" class="input" placeholder="Your Name" />
      </div>
      <p v-if="name_required && (!name || name === '')" class="required">Your name is required!</p>
    </div>

    <!-- Email -->
    <div class="mt-4">
      <label for="email" class="label">Email:</label>
      <div class="relative mt-2 rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MdiEmail class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input v-model="email" v-on:keyup.enter="submit()"
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
      <p v-if="password_required && (!password || password === '')" class="required">A password is required!</p>
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