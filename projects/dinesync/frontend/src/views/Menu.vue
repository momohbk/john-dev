<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-display font-bold text-center mb-8">Our Menu</h1>

    <div class="flex flex-wrap gap-3 justify-center mb-10">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        :class="[
          'px-5 py-2 rounded-full font-medium transition-colors',
          selectedCategory === category
            ? 'bg-brand-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
      >
        {{ category }}
      </button>
    </div>

    <div v-if="filteredItems.length === 0" class="text-center py-12 text-gray-500">
      No items in this category yet.
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="h-40 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
          <UtensilsCrossed class="w-12 h-12 text-brand-400" />
        </div>
        <div class="p-5">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-bold">{{ item.name }}</h3>
            <span class="text-brand-600 font-bold">${{ item.price }}</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">{{ item.description }}</p>
          <div class="flex items-center justify-between">
            <span
              :class="[
                'text-xs font-medium px-2 py-1 rounded-full',
                item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
              ]"
            >
              {{ item.available ? 'Available' : 'Sold Out' }}
            </span>
            <button
              @click="addToCart(item)"
              :disabled="!item.available"
              class="bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { UtensilsCrossed } from 'lucide-vue-next';
import { useCartStore } from '../stores/cart';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

const cartStore = useCartStore();
const selectedCategory = ref('All');
const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];

const menuItems = ref<MenuItem[]>([
  { id: 1, name: 'Bruschetta', description: 'Toasted bread with tomato, basil, and mozzarella.', price: 12, category: 'Appetizers', available: true },
  { id: 2, name: 'Calamari', description: 'Crispy fried squid with marinara sauce.', price: 14, category: 'Appetizers', available: true },
  { id: 3, name: 'Caesar Salad', description: 'Romaine lettuce, parmesan, croutons, Caesar dressing.', price: 11, category: 'Appetizers', available: true },
  { id: 4, name: 'Grilled Salmon', description: 'Atlantic salmon with herb crust and lemon butter.', price: 28, category: 'Main Course', available: true },
  { id: 5, name: 'Wagyu Steak', description: 'Prime Japanese wagyu with truffle mash.', price: 55, category: 'Main Course', available: true },
  { id: 6, name: 'Chicken Parmesan', description: 'Breaded chicken with marinara and melted mozzarella.', price: 22, category: 'Main Course', available: true },
  { id: 7, name: 'Pasta Carbonara', description: 'Spaghetti with pancetta, egg, and parmesan.', price: 18, category: 'Main Course', available: false },
  { id: 8, name: 'Tiramisu', description: 'Classic Italian tiramisu with mascarpone.', price: 14, category: 'Desserts', available: true },
  { id: 9, name: 'Panna Cotta', description: 'Vanilla panna cotta with berry compote.', price: 12, category: 'Desserts', available: true },
  { id: 10, name: 'Espresso', description: 'Double shot of our house espresso blend.', price: 4, category: 'Beverages', available: true },
  { id: 11, name: 'House Wine', description: 'Glass of our selected house red or white wine.', price: 9, category: 'Beverages', available: true },
]);

const filteredItems = computed(() => {
  if (selectedCategory.value === 'All') return menuItems.value;
  return menuItems.value.filter((item) => item.category === selectedCategory.value);
});

function addToCart(item: MenuItem) {
  cartStore.addItem(item);
}
</script>
