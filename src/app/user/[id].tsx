import { useLocalSearchParams } from 'expo-router';

import { UserProfileScreen } from '@/screens/user-profile-screen';

export default function UserProfileRoute() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;

  return <UserProfileScreen userId={userId} />;
}
