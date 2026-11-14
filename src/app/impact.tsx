import { useLocalSearchParams } from 'expo-router';

import { ImpactScreen } from '@/screens/impact-screen';

export default function ImpactRoute() {
  const params = useLocalSearchParams<{ swapId?: string | string[] }>();
  const swapId = Array.isArray(params.swapId) ? params.swapId[0] : params.swapId;

  return <ImpactScreen swapId={swapId} />;
}
