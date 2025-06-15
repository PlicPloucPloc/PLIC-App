export type ColorTheme = {
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  textContrast: string;
  background: string;
  backgroundSecondary: string;
  contrast: string;
};

const Colors = {
  light: {
    primary: '#68CADE',
    secondary: '#175676',
    textPrimary: '#000000',
    textSecondary: '#888',
    textContrast: '#eeffff',
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    contrast: '#000000',
  },
  dark: {
    primary: '#68CADE',
    secondary: '#175676',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textContrast: '#000000',
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    contrast: '#FFFFFF',
  },
};

export default Colors;
