import { Campaign, RawNode, Theme } from './types';

const hasText = (value: unknown): value is string => typeof value === 'string' && value.length > 0;
const hasTheme = (value: unknown): value is Theme => typeof value === 'object' && value !== null && ['primary', 'background', 'surface', 'text', 'accent'].every((key) => hasText((value as Record<string, unknown>)[key]));
const hasNodeIdentity = (node: unknown): node is RawNode => typeof node === 'object' && node !== null && hasText((node as Record<string, unknown>).id) && hasText((node as Record<string, unknown>).type);
const isAction = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null) return false;
  const action = value as Record<string, unknown>; const payload = action.payload;
  if (typeof payload !== 'object' || payload === null) return false;
  const data = payload as Record<string, unknown>;
  return (action.type === 'ADD_TO_CART' && hasText(data.id)) || (action.type === 'DEEP_LINK' && hasText(data.url)) || (action.type === 'APPLY_MYSTERY_GIFT_COUPON' && hasText(data.coupon));
};
const isProduct = (value: unknown): boolean => typeof value === 'object' && value !== null && ['id', 'name', 'price', 'image'].every((key) => hasText((value as Record<string, unknown>)[key])) && isAction((value as Record<string, unknown>).action);
const isTicket = (value: unknown): boolean => typeof value === 'object' && value !== null && ['id', 'title', 'date', 'price', 'image'].every((key) => hasText((value as Record<string, unknown>)[key])) && isAction((value as Record<string, unknown>).action);
const isSafeNode = (node: unknown): node is RawNode => {
  if (!hasNodeIdentity(node)) return false;
  const value = node as Record<string, unknown>;
  if (!['BANNER_HERO', 'PRODUCT_GRID_2X2', 'DYNAMIC_COLLECTION', 'EVENT_TICKET_ROW'].includes(value.type as string)) return true;
  if (!hasText(value.title)) return false;
  if (value.type === 'BANNER_HERO') return hasText(value.subtitle) && hasText(value.image) && isAction(value.action);
  if (value.type === 'EVENT_TICKET_ROW') return Array.isArray(value.tickets) && value.tickets.every(isTicket);
  return Array.isArray(value.items) && value.items.every(isProduct);
};
const isSafeOverlay = (node: unknown): node is Campaign['overlay'] => hasNodeIdentity(node) && (node as Record<string, unknown>).type === 'FULL_SCREEN_OVERLAY' && hasText((node as Record<string, unknown>).animation_url) && ['SCHOOL', 'SUMMER', 'MYSTERY'].includes((node as Record<string, unknown>).effect as string);

/** Treat external layout data as untrusted: malformed campaigns fall back before reaching the renderer. */
export const parseCampaign = (candidate: unknown, fallback: Campaign): Campaign => {
  if (typeof candidate !== 'object' || candidate === null) return fallback;
  const input = candidate as Partial<Campaign>;
  if (!hasText(input.id) || !hasText(input.label) || !hasTheme(input.theme) || !Array.isArray(input.nodes) || !isSafeOverlay(input.overlay)) return fallback;
  const nodes = input.nodes.filter(isSafeNode);
  return { ...fallback, id: input.id as Campaign['id'], label: input.label, theme: input.theme, nodes, overlay: input.overlay };
};
