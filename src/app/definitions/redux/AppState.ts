import { SwipeDirection } from '@ellmos/rn-swiper-list';

import { RootEnum } from './RootEnum';

export type AppState = {
  root: RootEnum;
  shouldRefetchLikeList: boolean;
  shouldRefetchHistory: boolean;
  swipeDirection?: SwipeDirection;
};
