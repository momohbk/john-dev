<template>
  <div>
    <section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 text-white">
      <div class="max-w-7xl mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div class="text-center">
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6">
            Welcome to <span class="text-brand-400">DineSync</span>
          </h1>
          <p class="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            Experience exceptional dining with handcrafted dishes made from the finest ingredients.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/menu"
              class="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              View Our Menu
            </router-link>
            <router-link
              to="/reservations"
              class="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg border border-white/30 transition-colors"
            >
              Make a Reservation
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-16">
      <h2 class="text-3xl font-display font-bold text-center mb-12">Featured Dishes</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="dish in featuredDishes"
          :key="dish.name"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="h-48 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
            <component :is="dish.icon" class="w-16 h-16 text-brand-500" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">{{ dish.name }}</h3>
            <p class="text-gray-600 mb-4">{{ dish.description }}</p>
            <p class="text-brand-600 font-bold text-lg">{{ dish.price }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-900 text-white py-16">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-display font-bold mb-4">Reserve Your Table</h2>
        <p class="text-gray-300 text-lg mb-8">
          Book your dining experience with us. We look forward to serving you.
        </p>
        <router-link
          to="/reservations"
          class="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-10 py-4 rounded-lg text-lg transition-colors"
        >
          Book Now
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { UtensilsCrossed, Beef, ChefHat } from 'lucide-vue-next';
import type { Component } from 'vue';

interface FeaturedDish {
  name: string;
  description: string;
  price: string;
  icon: Component;
}

const featuredDishes: FeaturedDish[] = [
  {
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with herb crust, seasonal vegetables, and lemon butter sauce.',
    price: '$28',
    icon: UtensilsCrossed,
  },
  {
    name: 'Wagyu Steak',
    description: 'Prime Japanese wagyu with truffle mash and red wine reduction.',
    price: '$55',
    icon: Beef,
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian tiramisu with mascarpone and espresso.',
    price: '$14',
    icon: ChefHat,
  },
];
</script>
