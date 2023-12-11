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
  const { logout, user } = useFirebase();
  const _logout = () => {
    _close_logout();
    logout();
  }
  const _close_logout = () => {
    emit('close');
  }
</script>

<template>
  <DialogTemplate :open="open" color="amber" submitLabel="Logout" @close="_close_logout" @submit="_logout">
    <template #icon><MdiLogout /></template>
    <template #title>Logout?</template>
    <template #description>
      Are you sure you want to logout<span v-if="!!user"> of the account <strong>{{ user.email }}</strong></span>?
    </template>
    <div v-if="error_message" class="error mt-6">
      <p>{{ error_message }}</p>
    </div>
  </DialogTemplate>
</template>