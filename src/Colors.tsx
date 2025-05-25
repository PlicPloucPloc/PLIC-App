// unused for now

export type ColorTheme = {
  primary: string;
  secondary: string;
  textSecondary: string;
  textPrimary: string;
};

const sharedColors = {
  black: '#000000',
  white: '#FFFFFF',
};

type SharedColors = typeof sharedColors;

export type TColors = ColorTheme & SharedColors;

type ColorPalettes = {
  light: TColors;
  dark: TColors;
};

const Colors: ColorPalettes = {
  light: {
    primary: '#4BA3C3',
    secondary: '#175676',
    textPrimary: sharedColors.white,
    textSecondary: '#67686E',
    ...sharedColors,
  },
  dark: {
    // not correctly setup
    primary: '#4BA3C3',
    secondary: '#175676',
    textPrimary: sharedColors.white,
    textSecondary: '#67686E',
    ...sharedColors,
  },
};

export default Colors;
