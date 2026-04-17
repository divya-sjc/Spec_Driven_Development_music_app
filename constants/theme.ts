import { Platform } from 'react-native';
import { colors, fontFamilies, fontWeights } from '@/utils';

const tintColorLight = colors.primary;
const tintColorDark = colors.tint.dark;

export const Colors = {
  light: {
    text: colors.text.primary.light,
    background: colors.background.light,
    tint: tintColorLight,
    icon: colors.icon.light,
    tabIconDefault: colors.icon.light,
    tabIconSelected: tintColorLight,
    surface: colors.surface.light,
    border: colors.border.light,
  },
  dark: {
    text: colors.text.primary.dark,
    background: colors.background.dark,
    tint: tintColorDark,
    icon: colors.icon.dark,
    tabIconDefault: colors.icon.dark,
    tabIconSelected: tintColorDark,
    surface: colors.surface.dark,
    border: colors.border.dark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: fontFamilies.sans,
    serif: fontFamilies.serif,
    rounded: 'System',
    mono: fontFamilies.mono,
  },
  default: {
    sans: fontFamilies.sans,
    serif: fontFamilies.serif,
    rounded: 'System',
    mono: fontFamilies.mono,
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export { colors, fontFamilies, fontWeights };
