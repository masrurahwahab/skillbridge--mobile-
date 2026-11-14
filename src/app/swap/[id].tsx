import { useLocalSearchParams } from 'expo-router';

import { SwapWorkspaceScreen } from '@/screens/swap-workspace-screen';

export default function SwapWorkspaceRoute() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const swapId = Array.isArray(params.id) ? params.id[0] : params.id;

  return <SwapWorkspaceScreen swapId={swapId} />;
}
