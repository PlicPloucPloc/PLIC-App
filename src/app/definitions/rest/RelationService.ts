import { ApartmentInfo } from './ApartmentService';

export enum RELATION_TYPE {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export type RelationInfo = {
  type: RELATION_TYPE;
  apt: ApartmentInfo;
};
