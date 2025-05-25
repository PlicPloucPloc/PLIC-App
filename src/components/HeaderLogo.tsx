import { Image } from 'react-native';

import { Images } from '@assets/index';

export default function HeaderLogo() {
  return (
    <Image
      source={Images.logo}
      style={{
        width: 35,
        height: 35,
        marginHorizontal: 15,
      }}
      resizeMode="contain"
    />
  );
}
