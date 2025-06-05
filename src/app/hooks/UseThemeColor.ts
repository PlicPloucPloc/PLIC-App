import { useColorScheme } from 'react-native';

import Colors from '../Colors';

export const useThemeColors = () => {
  const scheme = useColorScheme(); // 'light' | 'dark' | null
  // const theme = scheme === 'dark' ? Colors.dark : Colors.light;
  const theme = Colors.light;
  return theme;
};
