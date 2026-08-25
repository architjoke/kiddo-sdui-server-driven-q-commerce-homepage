import { useSyncExternalStore } from 'react';

let route = '/';
const listeners = new Set<() => void>();
export const navigationStore = {
  navigate(url: string) { route = url.startsWith('/') ? url : '/'; listeners.forEach((listener) => listener()); },
  subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener); },
  getSnapshot: () => route,
};
export const useCurrentRoute = () => useSyncExternalStore(navigationStore.subscribe, navigationStore.getSnapshot);
