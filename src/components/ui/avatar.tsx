import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Palette } from '@/constants/theme';

import { AppText } from './app-text';

type AvatarProps = {
  name: string;
  uri?: string;
  size?: number;
  ringColor?: string;
  style?: StyleProp<ViewStyle>;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function Avatar({ name, uri, size = 40, ringColor, style }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  return (
    <View
      accessibilityLabel={`${name}'s avatar`}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ringColor ? 2 : 0,
          borderColor: ringColor,
        },
        style,
      ]}>
      {uri && !failed ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={150}
          onError={() => setFailed(true)}
        />
      ) : (
        <AppText variant="label" color={Palette.primary} style={{ fontSize: size * 0.34 }}>
          {getInitials(name)}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: Palette.lavender,
  },
});
