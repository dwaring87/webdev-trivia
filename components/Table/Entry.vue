<script setup>
  import MdiDelete from '~icons/mdi/delete';

  const props = defineProps({
    team: String
  });

  const { teamScores } = useDatabase();
  const showDeleteDialog = ref(false);
</script>

<template>
  <td class="group cursor-pointer">
    <p class="group-hover:hidden">{{ teamScores(props.team).entry }}</p>
    <p class="hidden group-hover:block" @click="showDeleteDialog = true">
      <MdiDelete class="inline text-rose-800" />
    </p>
    <DialogDeleteTeam :open="showDeleteDialog" :team="team" @close="showDeleteDialog = false" />
  </td>
</template>