import { Text, type TextProps, type TextStyle } from 'react-native';

import { Palette, Typography } from '@/constants/theme';

type TextVariant = keyof typeof Typography;

type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: string;
  weight?: TextStyle['fontWeight'];
  align?: TextStyle['textAlign'];
};

export function AppText({
  variant = 'body',
  color = Palette.text,
  weight,
  align,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      {...rest}
      style={[
        Typography[variant],
        { color, textAlign: align, fontWeight: weight ?? Typography[variant].fontWeight },
        style,
      ]}
    />
  );
}
