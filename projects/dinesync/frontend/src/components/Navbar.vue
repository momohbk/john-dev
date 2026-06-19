<template>
  <nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center gap-2">
          <UtensilsCrossed class="w-6 h-6 text-brand-500" />
          <span class="text-xl font-display font-bold text-gray-900">DineSync</span>
        </router-link>

        <div class="hidden sm:flex items-center gap-6">
          <router-link
            v-for="link in links"
            :key="link.path"
            :to="link.path"
            class="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            :class="{ 'text-brand-600': $route.path === link.path }"
          >
            {{ link.label }}
          </router-link>

          <router-link
            to="/reservations"
            class="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Book a Table
          </router-link>
        </div>

        <button
          class="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          <Menu v-if="!mobileOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <div v-if="mobileOpen" class="sm:hidden pb-4 space-y-2 animate-fade-in-up">
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="block px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </router-link>
        <router-link
          to="/reservations"
          class="block px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium text-center"
          @click="mobileOpen = false"
        >
          Book a Table
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UtensilsCrossed, Menu, X } from 'lucide-vue-next';

const mobileOpen = ref(false);

const links = [
  { path: '/', label: 'Home' },
  { path: '/menu', label: 'Menu' },
  { path: '/admin', label: 'Admin' },
];
</script>
