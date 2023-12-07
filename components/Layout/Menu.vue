<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import MdiMenu from '~icons/mdi/menu';
import MdiClose from '~icons/mdi/close-thick';
import MdiMore from '~icons/mdi/dots-vertical';
import MdiLogo from '~icons/fluent/chat-bubbles-question-16-filled';

import MdiNewGame from '~icons/mdi/table-large-plus';
import MdiDeleteGame from '~icons/mdi/delete';
import MdiClearScores from '~icons/mdi/eraser';

const { public:config } = useRuntimeConfig();

const showCreateDialog = ref(false);
const showDeleteDialog = ref(false);
const showClearDialog = ref(false);

const main = [
  { 
    label: 'New Game',
    class: 'btn-white',
    icon: MdiNewGame,
    click: () => showCreateDialog.value = true 
  }
]

const more = [
  {
    label: 'Clear Scores',
    class: 'btn-amber',
    icon: MdiClearScores,
    click: () => showClearDialog.value = true
  },
  {
    label: 'Delete Game',
    class: 'btn-red',
    icon: MdiDeleteGame,
    click: () => showDeleteDialog.value = true
  }
]

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]

const open = ref(false);
</script>

<template>
  <Disclosure as="nav" class="bg-zinc-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-12 sm:h-14 items-center justify-between">

        <!-- Mobile menu button-->
        <div class="flex items-center sm:hidden">
          <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-gray-400/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-700">
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>
            <MdiMenu v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <MdiClose v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>

        <!-- Logo / Name -->
        <div class="flex sm:flex-1 items-center">
          <MdiLogo class="text-xl sm:text-2xl text-white" />
          <p class="ml-2 text-sm sm:text-lg text-white font-bold">{{ config.app_title }}</p>
        </div>

        <!-- Main Toolbar -->
        <div class="flex items-center justify-center sm:items-stretch sm:justify-between">
          <div class="sm:ml-6">
            <div class="flex items-center space-x-4">
              <button v-for="item in main" :key="item.label"
                  :class="`btn ${item.class}`" @click="item.click">
                <component :is="item.icon" class="inline sm:mr-2"></component>
                <span class="hidden sm:inline">{{ item.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Dropdown -->
        <div class="hidden sm:block absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-2 sm:pr-0">
          <Menu as="div" class="relative ml-3">
            <div>
              <MenuButton class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 focus:ring-offset-zinc-800">
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">Open user menu</span>
                <MdiMore class="text-xl text-white" />
              </MenuButton>
            </div>
            <transition 
                enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" 
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 origin-top-right rounded-md bg-white mt-1 p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-for="(item, index) in more" :key="item.label" 
                    :class="['p-2 whitespace-nowrap rounded-md', index !== 0 ? 'mt-1' : 'm-0']">
                  <DisclosureButton class="w-full flex justify-start items-center hover:bg-gray-200" @click="item.click">
                    <component :is="item.icon" :class="['inline mr-2 rounded-md w-8 h-8 p-1 shadow-sm', item.class]"></component>
                    <span>{{ item.label }}</span>
                  </DisclosureButton>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <DisclosurePanel class="sm:hidden">
      <div class="flex flex-col justify-start my-4 mx-2">
        <DisclosureButton v-for="(item, index) in [...main, ...more]" :key="item.label"
            :class="[`p-2 whitespace-nowrap rounded-md ${item.class}`, index === 0 ? 'rounded-t-md' : 'rounded-t-none', index === (main.length + more.length - 1) ? 'rounded-b-md' : 'rounded-b-none']" @click="item.click">
          <component :is="item.icon" class="inline mr-2"></component>
          <span>{{ item.label }}</span>
        </DisclosureButton>
      </div>
    </DisclosurePanel>

    <DialogCreateGame :open="showCreateDialog" @close="showCreateDialog = false" />
    <DialogDeleteGame :open="showDeleteDialog" @close="showDeleteDialog = false" />
    <DialogClearScores :open="showClearDialog" @close="showClearDialog = false" />
  </Disclosure>
</template>