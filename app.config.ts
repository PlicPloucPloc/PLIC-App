// Add this to import TypeScript files
import { ConfigContext, ExpoConfig } from 'expo/config';
import 'ts-node/register';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'SwAppart',
  slug: 'SwAppart',
});
