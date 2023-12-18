<script setup>
  import MdiDelete from '~icons/mdi/delete';

  const props = defineProps({
    team: String
  });

  const { editable, teamScores } = useDatabase();
  const showDeleteDialog = ref(false);
</script>

<template>
  <td :class="[editable ? 'cursor-pointer' : 'cursor-default', 'group']">
    <p :class="[editable ? 'block group-hover:hidden' : 'block']">{{ teamScores(props.team)?.entry }}</p>
    <p :class="[editable ? 'hidden group-hover:block' : 'hidden']" @click="showDeleteDialog = editable ? true : false">
      <MdiDelete class="inline text-rose-800" />
    </p>
    <DialogDeleteTeam :open="showDeleteDialog" :team="team" @close="showDeleteDialog = false" />
  </td>
</template>