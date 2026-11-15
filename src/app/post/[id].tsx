import { useLocalSearchParams } from 'expo-router';

import { PostThreadScreen } from '@/screens/post-thread-screen';

export default function PostThreadRoute() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return <PostThreadScreen postId={id} />;
}
