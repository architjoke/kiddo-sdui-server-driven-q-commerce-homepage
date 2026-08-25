# Kiddo SDUI Homepage

An Expo + TypeScript (strict mode) implementation of the Kiddo configuration-driven homepage brief.

## Run

```bash
npm install
npm run start
```

## Architecture

- `src/data/campaigns.ts` simulates server-delivered payloads for Back to School, Summer Playhouse, and Mystery Gift Carnival. Each profile supplies its own theme, overlay, and feed blocks, including dedicated Petting Zoo ticket cards.
- `App.tsx` renders the entire homepage with one vertical `FlashList`. `DYNAMIC_COLLECTION` owns its nested horizontal `FlashList`; stable callbacks and key extractors avoid churn.
- The registry is a scalable type-to-component map. Unsupported server types (the mock includes `NEW_COMPONENT_V2`) return `null` without destabilizing the feed.
- `src/actions.ts` is the only business-action coordinator. UI cards only forward their declarative `Action` configuration.
- `src/state/cartStore.ts` uses a tiny external store and `useSyncExternalStore`. Only `CartBadge` subscribes, so add-to-cart does not re-render the mounted feed blocks.
- `src/schema.ts` validates the untrusted campaign shape before it reaches the renderer and drops corrupt known nodes. `ThemeProvider` applies OTA theme data through context. Cached WebP textures plus cleanup-safe native-driver particles provide the three campaign overlays while `pointerEvents="none"` preserves underlying gestures and taps.
