<script setup>
  import MdiArrowUp from '~icons/mdi/arrow-up-thin';
  import MdiArrowDown from '~icons/mdi/arrow-down-thin';

  const props = defineProps({
    label: String,
    sortKey: String,
    sort: String,
    descending: Boolean
  });
</script>

<template>
  <th class="px-3 py-3.5 text-sm font-semibold cursor-pointer">
    <div :class="['flex', label === 'Team' ? 'justify-start' : 'justify-center']">
      <p class="whitespace-nowrap">{{ label }}</p>
      <div class="whitespace-nowrap" v-if="sortKey">
        <MdiArrowUp v-if="sort === sortKey && !descending" class="-mt-1 inline opacity-80" />
        <MdiArrowDown v-else-if="sort === sortKey && descending" class="-mt-1 inline opacity-80" />
        <MdiArrowUp v-else class="-mt-1 inline opacity-0" />
      </div>
    </div>
  </th>
</template>