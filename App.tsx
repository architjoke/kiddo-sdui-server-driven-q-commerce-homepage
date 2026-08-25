import { FlashList } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import { memo, useCallback, useMemo, useState } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View } from 'react-native';
import { CartBadge, CampaignOverlay, DynamicCollection, EventTicketRow, Hero, ProductGrid } from './src/components';
import { campaigns } from './src/data/campaigns';
import { useCurrentRoute } from './src/navigationStore';
import { parseCampaign } from './src/schema';
import { ThemeProvider, useTheme } from './src/theme';
import { Campaign, KnownNode, RawNode } from './src/types';

type Renderer = React.ComponentType<{ node: never }>;
const registry: Readonly<Record<KnownNode['type'], Renderer>> = {
  BANNER_HERO: Hero as Renderer,
  PRODUCT_GRID_2X2: ProductGrid as Renderer,
  DYNAMIC_COLLECTION: DynamicCollection as Renderer,
  EVENT_TICKET_ROW: EventTicketRow as Renderer,
};
const isRegisteredNode = (node: RawNode): node is KnownNode => Object.prototype.hasOwnProperty.call(registry, node.type);

const FeedNode = memo(({ node }: { node: RawNode }) => {
  if (!isRegisteredNode(node)) return null; // Unknown server nodes are intentionally isolated and dropped.
  const Component = registry[node.type];
  return <Component node={node as never} />;
});

function Home({ campaign, setCampaign }: { campaign: Campaign; setCampaign: (campaign: Campaign) => void }) {
  const theme = useTheme();
  const route = useCurrentRoute();
  const renderItem = useCallback(({ item }: { item: RawNode }) => <FeedNode node={item} />, []);
  const keyExtractor = useCallback((item: RawNode) => item.id, []);
  const overlay = campaign.overlay;
  return <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}><StatusBar style="dark" />
    <View style={styles.header}><View><Text style={[styles.brand, { color: theme.text }]}>kiddo</Text><Text style={[styles.location, { color: theme.text }]}>Delivering joy in 10 min · {route}</Text></View><CartBadge /></View>
    <View style={styles.tabs}>{campaigns.map((option) => <Pressable key={option.id} onPress={() => setCampaign(option)} style={[styles.tab, option.id === campaign.id && { backgroundColor: theme.primary }]}><Text style={[styles.tabText, { color: option.id === campaign.id ? '#fff' : theme.text }]}>{option.label}</Text></Pressable>)}</View>
    <FlashList data={campaign.nodes} renderItem={renderItem} keyExtractor={keyExtractor} showsVerticalScrollIndicator={false} contentContainerStyle={styles.feed} removeClippedSubviews />
    <CampaignOverlay node={overlay} />
  </SafeAreaView>;
}

export default function App() {
  const [campaign, setCampaign] = useState(campaigns[0]);
  const stableCampaign = useMemo(() => parseCampaign(campaign, campaigns[0]), [campaign]);
  return <ThemeProvider theme={stableCampaign.theme}><Home campaign={stableCampaign} setCampaign={setCampaign} /></ThemeProvider>;
}
const styles = StyleSheet.create({ screen: { flex: 1 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 }, brand: { fontSize: 27, fontWeight: '900' }, location: { fontSize: 12, fontWeight: '600' }, tabs: { flexDirection: 'row', gap: 7, paddingHorizontal: 16, paddingTop: 14 }, tab: { borderRadius: 16, paddingHorizontal: 10, paddingVertical: 8 }, tabText: { fontSize: 11, fontWeight: '800' }, feed: { paddingBottom: 34 } });
