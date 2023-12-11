<script setup>
  import MdiLogout from '~icons/mdi/logout';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close']);

  const error_message = ref();
  const { logout, email } = useFirebase();
  const submit = () => {
    logout();
    close();
  }
  const close = () => {
    emit('close');
  }
</script>

<template>
  <DialogTemplate :open="open" color="amber" submitLabel="Logout" @close="close" @submit="submit">
    <template #icon><MdiLogout /></template>
    <template #title>Logout?</template>
    <template #description>
      Are you sure you want to logout<span v-if="!!email"> of the account <strong>{{ email }}</strong></span>?
    </template>
    <div v-if="error_message" class="error mt-6">
      <p>{{ error_message }}</p>
    </div>
  </DialogTemplate>
</template>