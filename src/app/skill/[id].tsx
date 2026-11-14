import { useLocalSearchParams } from 'expo-router';

import { SkillDetailsScreen } from '@/screens/skill-details-screen';

export default function SkillDetailsRoute() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const skillId = Array.isArray(params.id) ? params.id[0] : params.id;

  return <SkillDetailsScreen skillId={skillId} />;
}
