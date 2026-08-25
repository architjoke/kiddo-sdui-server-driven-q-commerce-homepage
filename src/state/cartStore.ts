import { useSyncExternalStore } from 'react';

type CartState = { count: number; items: Readonly<Record<string, number>> };
let state: CartState = { count: 0, items: {} };
const listeners = new Set<() => void>();
const itemListeners = new Map<string, Set<() => void>>();
const notify = () => listeners.forEach((listener) => listener());

export const cartStore = {
  add(productId: string) {
    state = { count: state.count + 1, items: { ...state.items, [productId]: (state.items[productId] ?? 0) + 1 } };
    notify();
    itemListeners.get(productId)?.forEach((listener) => listener());
  },
  getSnapshot: () => state,
  subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener); },
  subscribeToItem(productId: string, listener: () => void) {
    const subscribers = itemListeners.get(productId) ?? new Set<() => void>();
    subscribers.add(listener); itemListeners.set(productId, subscribers);
    return () => { subscribers.delete(listener); if (subscribers.size === 0) itemListeners.delete(productId); };
  },
};

export const useCartCount = () => useSyncExternalStore(cartStore.subscribe, () => cartStore.getSnapshot().count);
export const useProductQuantity = (productId: string) => useSyncExternalStore(
  (listener) => cartStore.subscribeToItem(productId, listener),
  () => cartStore.getSnapshot().items[productId] ?? 0,
);
