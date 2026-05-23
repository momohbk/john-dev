import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  function addItem(menuItem: { id: number; name: string; price: number }) {
    const existing = items.value.find((item) => item.id === menuItem.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.value.push({ ...menuItem, quantity: 1 });
    }
  }

  function removeItem(itemId: number) {
    const index = items.value.findIndex((item) => item.id === itemId);
    if (index === -1) return;
    if (items.value[index]!.quantity > 1) {
      items.value[index]!.quantity--;
    } else {
      items.value.splice(index, 1);
    }
  }

  function clearCart() {
    items.value = [];
  }

  return { items, total, count, addItem, removeItem, clearCart };
});
