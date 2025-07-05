import { ApartmentInfo } from './ApartmentService';

export enum RELATION_TYPE {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

export type RelationInfo = {
  type: RELATION_TYPE;
  apt: ApartmentInfo;
};
