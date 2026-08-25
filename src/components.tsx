import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { handleAction } from './actions';
import { useCartCount, useProductQuantity } from './state/cartStore';
import { useTheme } from './theme';
import { CollectionNode, GridNode, HeroNode, OverlayNode, Product, Ticket, TicketRowNode } from './types';

const { width } = Dimensions.get('window');

const ProductCard = memo(({ product }: { product: Product }) => {
  const theme = useTheme();
  const quantity = useProductQuantity(product.id);
  const onPress = useCallback(() => { void handleAction(product.action); }, [product.action]);
  return <Pressable onPress={onPress} style={[styles.product, { backgroundColor: theme.surface }]} accessibilityRole="button" accessibilityLabel={`Add ${product.name} to cart`}>
    <Image source={product.image} cachePolicy="memory-disk" transition={150} style={styles.productImage} contentFit="cover" />
    <Text numberOfLines={2} style={[styles.productName, { color: theme.text }]}>{product.name}</Text>
    <View style={styles.productFooter}><Text style={[styles.price, { color: theme.primary }]}>{product.price}</Text><Text style={[styles.add, { backgroundColor: quantity ? theme.accent : theme.primary, color: quantity ? theme.text : '#fff' }]}>{quantity ? `ADDED ${quantity}` : 'ADD'}</Text></View>
  </Pressable>;
});

export const CartBadge = memo(() => {
  const count = useCartCount();
  const theme = useTheme();
  return <View style={[styles.cart, { backgroundColor: theme.primary }]}><Text style={styles.cartText}>Cart {count}</Text></View>;
});

export const Hero = memo(({ node }: { node: HeroNode }) => {
  const theme = useTheme();
  const onPress = useCallback(() => { void handleAction(node.action); }, [node.action]);
  return <Pressable onPress={onPress} style={[styles.hero, { backgroundColor: theme.primary }]}>
    <Image source={node.image} cachePolicy="memory-disk" style={StyleSheet.absoluteFill} contentFit="cover" />
    <View style={styles.heroShade} /><View style={styles.heroContent}><Text style={styles.heroTitle}>{node.title}</Text><Text style={styles.heroSubtitle}>{node.subtitle}</Text><Text style={[styles.heroCta, { color: theme.primary }]}>EXPLORE NOW</Text></View>
  </Pressable>;
});

export const ProductGrid = memo(({ node }: { node: GridNode }) => {
  const theme = useTheme();
  return <View style={styles.section}><Text style={[styles.title, { color: theme.text }]}>{node.title}</Text><View style={styles.grid}>{node.items.slice(0, 4).map((item) => <ProductCard key={item.id} product={item} />)}</View></View>;
});

export const DynamicCollection = memo(({ node }: { node: CollectionNode }) => {
  const theme = useTheme();
  const renderItem = useCallback(({ item }: { item: Product }) => <ProductCard product={item} />, []);
  const keyExtractor = useCallback((item: Product) => item.id, []);
  return <View style={styles.section}><Text style={[styles.eyebrow, { color: theme.primary }]}>{node.eyebrow}</Text><Text style={[styles.title, { color: theme.text }]}>{node.title}</Text>
    <FlashList horizontal data={node.items} renderItem={renderItem} keyExtractor={keyExtractor} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList} nestedScrollEnabled />
  </View>;
});

const TicketCard = memo(({ ticket }: { ticket: Ticket }) => {
  const theme = useTheme();
  const onPress = useCallback(() => { void handleAction(ticket.action); }, [ticket.action]);
  return <Pressable onPress={onPress} style={[styles.ticket, { backgroundColor: theme.surface }]}><Image source={ticket.image} cachePolicy="memory-disk" style={styles.ticketImage} contentFit="cover" /><View style={styles.ticketBody}><Text style={[styles.ticketTitle, { color: theme.text }]}>{ticket.title}</Text><Text style={[styles.ticketDate, { color: theme.text }]}>{ticket.date}</Text><Text style={[styles.ticketPrice, { color: theme.primary }]}>{ticket.price} · BOOK</Text></View></Pressable>;
});

export const EventTicketRow = memo(({ node }: { node: TicketRowNode }) => {
  const theme = useTheme();
  return <View style={styles.section}><Text style={[styles.title, { color: theme.text }]}>{node.title}</Text><View style={styles.ticketRow}>{node.tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)}</View></View>;
});

const effectSymbols: Record<OverlayNode['effect'], string[]> = { SCHOOL: ['✈', '✎', '✦', '✎'], SUMMER: ['●', '💦', '●', '✦'], MYSTERY: ['◆', '✦', '●', '◆', '✦'] };
const effectColors: Record<OverlayNode['effect'], string[]> = { SCHOOL: ['#1254C0', '#FFD916', '#1254C0'], SUMMER: ['#087EA4', '#54D8F7', '#F7D657'], MYSTERY: ['#C72636', '#FFCA35', '#7D204B'] };
const Particle = memo(({ symbol, color, left, delay }: { symbol: string; color: string; left: number; delay: number }) => {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => { const loop = Animated.loop(Animated.sequence([Animated.delay(delay), Animated.timing(progress, { toValue: 1, duration: 3600, useNativeDriver: true }), Animated.timing(progress, { toValue: 0, duration: 0, useNativeDriver: true })])); loop.start(); return () => loop.stop(); }, [delay, progress]);
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [-90, Dimensions.get('window').height + 90] });
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '300deg'] });
  return <Animated.Text style={[styles.particle, { color, left, opacity: 0.75, transform: [{ translateY }, { rotate }] }]}>{symbol}</Animated.Text>;
});

export const CampaignOverlay = memo(({ node }: { node: OverlayNode }) => {
  // expo-image disk-caches the remote WebP texture; native-driver particles animate without JS scroll work.
  const symbols = effectSymbols[node.effect]; const colors = effectColors[node.effect];
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Image source={node.animation_url} cachePolicy="memory-disk" style={[StyleSheet.absoluteFill, styles.overlayTexture]} contentFit="cover" />
    {symbols.map((symbol, index) => <Particle key={`${node.id}-${index}`} symbol={symbol} color={colors[index % colors.length]} left={8 + ((index * 23) % 82)} delay={index * 510} />)}
  </View>;
});

const styles = StyleSheet.create({
  section: { marginTop: 20 }, eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginHorizontal: 16, marginBottom: 3 }, title: { fontSize: 20, fontWeight: '800', marginHorizontal: 16, marginBottom: 11 },
  hero: { height: 220, marginHorizontal: 16, marginTop: 12, overflow: 'hidden', borderRadius: 22, justifyContent: 'flex-end' }, heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.33)' }, heroContent: { padding: 20 }, heroTitle: { color: '#fff', fontSize: 30, fontWeight: '900' }, heroSubtitle: { color: '#fff', fontSize: 14, marginTop: 4 }, heroCta: { alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 18, fontSize: 11, fontWeight: '900', marginTop: 14, overflow: 'hidden', paddingHorizontal: 13, paddingVertical: 9 },
  horizontalList: { paddingHorizontal: 16, paddingBottom: 2 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16 }, product: { borderRadius: 16, marginRight: 10, overflow: 'hidden', padding: 9, shadowColor: '#000', shadowOpacity: .08, shadowRadius: 8, elevation: 2, width: 150 }, productImage: { borderRadius: 11, height: 112, width: '100%' }, productName: { fontSize: 13, fontWeight: '700', height: 36, marginTop: 8 }, productFooter: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }, price: { fontSize: 14, fontWeight: '900' }, add: { borderRadius: 10, color: '#fff', fontSize: 10, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 6 }, ticketRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16 }, ticket: { borderRadius: 16, flex: 1, overflow: 'hidden' }, ticketImage: { height: 88, width: '100%' }, ticketBody: { padding: 10 }, ticketTitle: { fontSize: 14, fontWeight: '800' }, ticketDate: { fontSize: 11, marginTop: 4, opacity: .7 }, ticketPrice: { fontSize: 12, fontWeight: '900', marginTop: 8 }, overlayTexture: { opacity: .08 }, particle: { fontSize: 26, position: 'absolute', top: 0 }, cart: { borderRadius: 18, paddingHorizontal: 13, paddingVertical: 8 }, cartText: { color: '#fff', fontSize: 12, fontWeight: '800' },
});
