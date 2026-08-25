import { Campaign, Product } from '../types';

const image = (seed: string) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=500&q=80`;
const product = (id: string, name: string, price: string, seed: string): Product => ({
  id, name, price, image: image(seed), action: { type: 'ADD_TO_CART', payload: { id } },
});

const baseProducts = [
  product('p1', 'Soft Cotton Onesie', '₹399', 'photo-1522771930-78848d9293e8'),
  product('p2', 'Rainbow Stacking Cups', '₹249', 'photo-1596461404969-9ae70f2830c1'),
  product('p3', 'Gentle Baby Wash', '₹199', 'photo-1556229010-6c3f2c9ca5f8'),
  product('p4', 'Story Time Book', '₹299', 'photo-1544947950-fa07a98d237f'),
  product('p5', 'Leakproof Lunchbox', '₹549', 'photo-1547592180-85f173990554'),
  product('p6', 'Animal Pencil Case', '₹329', 'photo-1513364776144-60967b0f800f'),
  product('p7', 'Kids Water Bottle', '₹449', 'photo-1602143407151-7111542de6e8'),
  product('p8', 'Sun Hat', '₹379', 'photo-1519238360530-a39f6b55c5f2'),
  product('p9', 'Beach Bucket Set', '₹599', 'photo-1507525428034-b723cf961d3e'),
  product('p10', 'Wooden Puzzle', '₹459', 'photo-1596464716127-f2a82984de30'),
  product('p11', 'Muslin Blanket', '₹699', 'photo-1584100936595-c0654b55a2e2'),
  product('p12', 'Colouring Kit', '₹279', 'photo-1513364776144-60967b0f800f'),
];

const collection = (id: string, title: string, prefix: string, offset = 0) => ({
  id, type: 'DYNAMIC_COLLECTION' as const, title, eyebrow: 'PICKED FOR YOU',
  items: Array.from({ length: 4 }, (_, index) => {
    const item = baseProducts[(offset + index) % baseProducts.length];
    const id = `${prefix}-${item.id}-${index}`;
    return { ...item, id, action: { type: 'ADD_TO_CART' as const, payload: { id } } };
  }),
});

const schoolSections = ['Top stationery picks', 'After-school favourites', 'First-day essentials', 'Writing & drawing', 'School bags they love', 'Lunch break heroes', 'Uniform-ready basics', 'Smart study corner', 'Creative classroom kits', 'Rainy-day school gear', 'Tiny tech learners', 'Books for curious minds', 'Teacher-approved finds', 'Desk organisation', 'Weekend homework helpers', 'Pocket-money picks', 'Sports day ready', 'Snack box stars', 'Comfy socks & shoes', 'Art class supplies', 'Science explorer kits', 'Travel-to-school picks', 'Name-label essentials', 'Best-selling backpacks', 'Early learner favourites', 'Study break fun', 'Craft & create', 'School-time skincare', 'Monsoon must-haves', 'Last-minute essentials'];
const summerSections = ['Poolside play', 'Cool kid picks', 'Beach day essentials', 'Outdoor adventure', 'Sun-safe favourites', 'Garden playtime', 'Holiday travel kit', 'Water fun heroes', 'Ice cream day picks', 'Little explorer gear', 'Picnic-ready finds', 'Weekend activity box', 'Summer story corner', 'Bright day basics', 'Vacation crafts', 'Playdate favourites', 'Easy breezy outfits', 'Nature discovery', 'Camp day pack', 'Fruit snack time', 'Road trip essentials', 'Backyard fun', 'Cooling comfort', 'Family outing picks', 'Summer gifting', 'Tiny swimmer picks', 'Sand & splash toys', 'Sunny-day books', 'Fresh start bath time', 'Monsoon preview'];
const mysterySections = ['Lucky finds', 'Carnival favourites', 'Surprise-ready toys', 'Golden ticket picks', 'Mystery box treats', 'Prize counter stars', 'Colour-pop essentials', 'Big top bestsellers', 'Secret gift ideas', 'Confetti collection', 'Spin-to-win picks', 'Joyful little things', 'Treasure hunt toys', 'Party bag fillers', 'Limited carnival finds', 'Lucky dip books', 'Gift-wrap favourites', 'Playful surprises', 'Celebration snacks', 'Prize-worthy crafts', 'Bright red picks', 'Hidden gem toys', 'Weekend reward picks', 'Festive family finds', 'Coupon unlocks', 'Happy dance essentials', 'Mini celebration kit', 'Mystery bundle picks', 'Final call favourites', 'Grand finale gifts'];

export const campaigns: Campaign[] = [
  {
    id: 'school', label: 'Back to School',
    theme: { primary: '#1254C0', background: '#FFF6B8', surface: '#FFFFFF', text: '#102A5C', accent: '#FFD916' },
    overlay: { id: 'school-overlay', type: 'FULL_SCREEN_OVERLAY', effect: 'SCHOOL', animation_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?fm=webp&auto=format&fit=crop&w=800&q=70' },
    nodes: [
      { id: 'school-hero', type: 'BANNER_HERO', title: 'Back to School', subtitle: 'Big little wins for every school day', image: image('photo-1503676260728-1c00da094a0b'), action: { type: 'DEEP_LINK', payload: { url: '/campaign/back-to-school' } } },
      collection('lunch-bags', 'Lunchboxes & Bags', 'school'),
      { id: 'school-grid', type: 'PRODUCT_GRID_2X2', title: 'Classroom essentials', items: baseProducts },
      { id: 'future-block', type: 'NEW_COMPONENT_V2', experiment: true },
      ...schoolSections.map((title, i) => collection(`school-more-${i}`, title, `s${i}`, i)),
    ],
  },
  {
    id: 'summer', label: 'Summer Playhouse',
    theme: { primary: '#087EA4', background: '#E4F9FF', surface: '#FFFFFF', text: '#073A52', accent: '#7BE1F4' },
    overlay: { id: 'summer-overlay', type: 'FULL_SCREEN_OVERLAY', effect: 'SUMMER', animation_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=webp&auto=format&fit=crop&w=800&q=70' },
    nodes: [
      { id: 'summer-hero', type: 'BANNER_HERO', title: 'Summer Playhouse', subtitle: 'Sun-safe fun starts here', image: image('photo-1507525428034-b723cf961d3e'), action: { type: 'DEEP_LINK', payload: { url: '/campaign/summer' } } },
      { id: 'zoo-tickets', type: 'EVENT_TICKET_ROW', title: 'Petting Zoo Tickets', tickets: [{ id: 'zoo-pass', title: 'Little Explorer Pass', date: 'Saturday · 11:00 AM', price: '₹199', image: image('photo-1548767797-d8c844163c4c'), action: { type: 'DEEP_LINK', payload: { url: '/events/petting-zoo' } } }, { id: 'zoo-family', title: 'Family Safari Pass', date: 'Sunday · 3:00 PM', price: '₹499', image: image('photo-1557050543-4d5f4e07ef46'), action: { type: 'DEEP_LINK', payload: { url: '/events/petting-zoo/family' } } }] },
      { id: 'summer-grid', type: 'PRODUCT_GRID_2X2', title: 'Play all day', items: baseProducts },
      ...summerSections.map((title, i) => collection(`summer-more-${i}`, title, `su${i}`, i + 3)),
    ],
  },
  {
    id: 'mystery', label: 'Mystery Gift',
    theme: { primary: '#C72636', background: '#FFF0F0', surface: '#FFFFFF', text: '#59121A', accent: '#FFCA35' },
    overlay: { id: 'mystery-overlay', type: 'FULL_SCREEN_OVERLAY', effect: 'MYSTERY', animation_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?fm=webp&auto=format&fit=crop&w=800&q=70' },
    nodes: [
      { id: 'mystery-hero', type: 'BANNER_HERO', title: 'Mystery Gift Carnival', subtitle: 'Every basket unlocks a surprise', image: image('photo-1530103862676-de8c9debad1d'), action: { type: 'APPLY_MYSTERY_GIFT_COUPON', payload: { coupon: 'SURPRISE' } } },
      collection('mystery-picks', 'Mystery carnival picks', 'mystery'),
      { id: 'mystery-grid', type: 'PRODUCT_GRID_2X2', title: 'Open a little joy', items: baseProducts },
      ...mysterySections.map((title, i) => collection(`mystery-more-${i}`, title, `my${i}`, i + 6)),
    ],
  },
];
