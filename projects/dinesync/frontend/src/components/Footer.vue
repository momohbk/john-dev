<template>
  <footer class="bg-gray-900 text-gray-400">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <UtensilsCrossed class="w-5 h-5 text-brand-400" />
            <span class="text-lg font-display font-bold text-white">DineSync</span>
          </div>
          <p class="text-sm">Experience exceptional dining in an unforgettable atmosphere.</p>
        </div>

        <div>
          <h3 class="text-white font-semibold mb-4">Hours</h3>
          <ul class="space-y-2 text-sm">
            <li>Mon – Thu: 11:00 – 22:00</li>
            <li>Fri – Sat: 11:00 – 23:00</li>
            <li>Sunday: 12:00 – 21:00</li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-semibold mb-4">Contact</h3>
          <ul class="space-y-2 text-sm">
            <li>123 Culinary Ave, Foodville</li>
            <li>+1 (555) 123-4567</li>
            <li>hello@dinesync.com</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
        &copy; {{ new Date().getFullYear() }} DineSync. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { UtensilsCrossed } from 'lucide-vue-next';
</script>
