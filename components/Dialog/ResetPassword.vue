<script setup>
  import MdiReset from '~icons/mdi/lock-reset';
  import MdiEmail from '~icons/mdi/email';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close']);

  const email = ref();
  const error_message = ref();
  
  const { resetPassword } = useAuth();
  const submit = async () => {
    if ( email.value ) {
      const error = await resetPassword(email.value);
      if ( error ) {
        error_message.value = error;
      }
      else {
        close();
      }
    }
  }
  const close = () => {
    emit('close');
  }
</script>

<template>
  <DialogTemplate :open="open" color="amber" submitLabel="Reset Password" @close="close" @submit="submit">
    <template #icon><MdiReset /></template>
    <template #title>Reset Password?</template>
    <template #description>Enter your email address to request a password reset link.</template>

    <div class="mt-8 mb-4">
      <label for="email" class="label">Email:</label>
      <div class="relative mt-2 rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MdiEmail class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input v-model="email" v-on:keyup.enter="submit()"
          type="email" name="email" id="email" class="input" placeholder="Your Email Address" />
      </div>
    </div>

    <div v-if="error_message" class="error mt-6">
      <p>{{ error_message }}</p>
    </div>
  </DialogTemplate>
</template>