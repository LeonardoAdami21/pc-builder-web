import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "../service/types";
import { formatPrice } from "../utils/utils";

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clear: () => void;
  toggleCart: () => void;

  // Computed
  totalItems: () => number;
  totalPrice: () => number;
  formattedTotal: () => string;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existing = items.find((i) => i.product.id === product.id);

        if (existing) {
          const newQty = Math.min(existing.quantity + quantity, product.stock);
          set({
            items: items.map((i) =>
              i.product.id === product.id ? { ...i, quantity: newQty } : i,
            ),
          });
        } else {
          set({
            items: [
              ...items,
              { product, quantity: Math.min(quantity, product.stock) },
            ],
          });
        }
        set({ isOpen: true });
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),

      updateQty: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: Math.min(quantity, i.product.stock) }
              : i,
          ),
        });
      },

      clear: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + Number(i.product.price) * i.quantity,
          0,
        ),
      formattedTotal: () => formatPrice(get().totalPrice()),
    }),
    { name: "cart-storage", partialize: (s) => ({ items: s.items }) },
  ),
);
