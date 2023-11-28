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
    <p class="inline">{{ label }}</p>
    <MdiArrowUp :class="['inline ml-1 -mr-1', sort === sortKey && !descending ? 'opacity-80' : 'opacity-20']" />
    <MdiArrowDown :class="['inline -ml-1 mr-1', sort === sortKey && descending ? 'opacity-80' : 'opacity-20']" />
  </th>
</template>