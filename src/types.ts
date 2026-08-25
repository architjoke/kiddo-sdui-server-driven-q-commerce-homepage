export type Theme = { primary: string; background: string; surface: string; text: string; accent: string };

export type Action =
  | { type: 'ADD_TO_CART'; payload: { id: string } }
  | { type: 'DEEP_LINK'; payload: { url: string } }
  | { type: 'APPLY_MYSTERY_GIFT_COUPON'; payload: { coupon: string } };

export type Product = { id: string; name: string; price: string; image: string; action: Action };
export type Ticket = { id: string; title: string; date: string; price: string; image: string; action: Action };
export type HeroNode = { id: string; type: 'BANNER_HERO'; title: string; subtitle: string; image: string; action: Action };
export type GridNode = { id: string; type: 'PRODUCT_GRID_2X2'; title: string; items: Product[] };
export type CollectionNode = { id: string; type: 'DYNAMIC_COLLECTION'; title: string; eyebrow?: string; items: Product[] };
export type TicketRowNode = { id: string; type: 'EVENT_TICKET_ROW'; title: string; tickets: Ticket[] };
export type OverlayNode = { id: string; type: 'FULL_SCREEN_OVERLAY'; animation_url: string; effect: 'SCHOOL' | 'SUMMER' | 'MYSTERY' };
export type KnownNode = HeroNode | GridNode | CollectionNode | TicketRowNode;
export type RawNode = KnownNode | OverlayNode | { id: string; type: string; [key: string]: unknown };

export type Campaign = {
  id: 'school' | 'summer' | 'mystery';
  label: string;
  theme: Theme;
  overlay: OverlayNode;
  nodes: RawNode[];
};
