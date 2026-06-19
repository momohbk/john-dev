import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, Product, ProductVariant } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: number, variantId?: number) => void;
  updateQuantity: (productId: number, quantity: number, variantId?: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

function itemKey(productId: number, variantId?: number): string {
  return variantId ? `${productId}-${variantId}` : `${productId}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, quantity = 1, variant?: ProductVariant) => {
    setItems(prev => {
      const key = itemKey(product.id, variant?.id);
      const existingIdx = prev.findIndex(i => itemKey(i.product.id, i.selectedVariant?.id) === key);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], quantity: updated[existingIdx].quantity + quantity };
        return updated;
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });
  }, []);

  const removeItem = useCallback((productId: number, variantId?: number) => {
    setItems(prev => prev.filter(i => itemKey(i.product.id, i.selectedVariant?.id) !== itemKey(productId, variantId)));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number, variantId?: number) => {
    if (quantity <= 0) { removeItem(productId, variantId); return; }
    setItems(prev =>
      prev.map(i =>
        itemKey(i.product.id, i.selectedVariant?.id) === itemKey(productId, variantId)
          ? { ...i, quantity }
          : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => {
    const price = i.product.price + (i.selectedVariant?.price_modifier || 0);
    return sum + price * i.quantity;
  }, 0);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
