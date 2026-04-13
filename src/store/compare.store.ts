import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import type { Product } from "../service/types";

const MAX = 4;

interface CompareState {
  ids: string[];
  products: Product[];
  isOpen: boolean;

  add: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggle: () => void;
  has: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      products: [],
      isOpen: false,

      add: (product) => {
        const { ids, products } = get();
        if (ids.includes(product.id)) {
          toast.error("Produto já está na comparação");
          return;
        }
        if (ids.length >= MAX) {
          toast.error(`Máximo de ${MAX} produtos para comparar`);
          return;
        }
        set({ ids: [...ids, product.id], products: [...products, product] });
        toast.success("Adicionado à comparação");
      },

      remove: (id) =>
        set({
          ids: get().ids.filter((i) => i !== id),
          products: get().products.filter((p) => p.id !== id),
        }),

      clear: () => set({ ids: [], products: [] }),
      toggle: () => set({ isOpen: !get().isOpen }),
      has: (id) => get().ids.includes(id),
    }),
    {
      name: "compare-storage",
      partialize: (s) => ({ ids: s.ids, products: s.products }),
    },
  ),
);
