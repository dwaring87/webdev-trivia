<template>
  <div class="flex flex-col w-full min-h-screen">
    <LayoutMenu class="fixed top-0 left-0 w-full z-30" />
    <main class="pt-14">
      <slot></slot>
    </main>
    <LayoutFooter class="mt-auto" />
  </div>
</template>