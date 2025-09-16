import { Alert } from 'react-native';

import { API_PAGE_SIZE } from '@app/config/constants.ts';
import { RELATION_TYPE, RelationInfo } from '@app/definitions';
import { setShouldRefetchHistory, setShouldRefetchLikeList } from '@app/redux/slices/index.ts';
import store from '@app/redux/Store.ts';
import { alertOnResponseError } from '@app/utils/Error.tsx';

import { apiFetch } from './Client';
import Endpoints from './Endpoints';
import { getApartmentThumbnail } from './S3Service.ts';

export async function getAllRelationsPaginated(
  offset: number,
  pageSize: number = API_PAGE_SIZE,
): Promise<RelationInfo[]> {
  const response = await apiFetch(
    Endpoints.RELATIONS.GET_ALL_PAGINATED(offset, pageSize),
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnResponseError(response, 'Relation', 'getting all relations')) {
    return [];
  }

  const relationsInfo = (await response.json()) as RelationInfo[];

  for (const relation of relationsInfo) {
    relation.apt.image_thumbnail = await getApartmentThumbnail(relation.apt);
  }

  return relationsInfo;
}

export async function getLikedApartmentsPaginated(
  isFilterColoc: boolean,
  offset: number,
  pageSize: number = API_PAGE_SIZE,
): Promise<RelationInfo[]> {
  const response = await apiFetch(
    Endpoints.RELATIONS.GET_LIKES_PAGINATED(isFilterColoc, offset, pageSize),
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnResponseError(response, 'Relation', 'getting likes')) {
    return [];
  }

  const relationsInfo = (await response.json()) as RelationInfo[];

  for (const relation of relationsInfo) {
    relation.apt.image_thumbnail = await getApartmentThumbnail(relation.apt);
  }

  return relationsInfo;
}

export async function getDislikedApartmentPaginated(
  offset: number,
  pageSize: number = API_PAGE_SIZE,
): Promise<RelationInfo[]> {
  const response = await apiFetch(
    Endpoints.RELATIONS.GET_DISLIKES_PAGINATED(offset, pageSize),
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnResponseError(response, 'Relation', 'getting dislikes')) {
    return [];
  }

  const relationsInfo = (await response.json()) as RelationInfo[];

  return relationsInfo;
}

export async function postRelation(apartmentId: number, type: RELATION_TYPE): Promise<boolean> {
  const response = await apiFetch(
    Endpoints.RELATIONS.POST_RELATION,
    {
      method: 'POST',
      body: JSON.stringify({ aptId: apartmentId, isLike: type === RELATION_TYPE.LIKE }),
    },
    true,
  );

  if (!response.ok) {
    const errorData = await response.json();

    if (errorData.message == 'Relation already exists') {
      console.warn(
        `Failed to post relation for apartment ID ${apartmentId}. Relation already exists, updating it instead.`,
      );

      return updateRelation(apartmentId, type);
    }

    Alert.alert('Relation Error', errorData.message || 'An error occurred while posting relation.');
  }

  updateShouldRefetchStates(type === RELATION_TYPE.LIKE);

  return true;
}

export async function updateRelation(apartmentId: number, type: RELATION_TYPE): Promise<boolean> {
  const response = await apiFetch(
    Endpoints.RELATIONS.UPDATE_RELATION,
    {
      method: 'PUT',
      body: JSON.stringify({ aptId: apartmentId, isLike: type === RELATION_TYPE.LIKE }),
    },
    true,
  );

  if (await alertOnResponseError(response, 'Relation', 'updating relation')) return false;

  updateShouldRefetchStates(true);

  return true;
}

export async function deleteRelation(apartmentId: number): Promise<boolean> {
  const response = await apiFetch(
    Endpoints.RELATIONS.DELETE_RELATION,
    {
      method: 'DELETE',
      body: JSON.stringify({ aptId: apartmentId }),
    },
    true,
  );

  if (response.status === 404) return true;

  if (await alertOnResponseError(response, 'Relation', 'deleting relation')) return false;

  updateShouldRefetchStates(true);

  return true;
}

const updateShouldRefetchStates = (shouldRefreshLikeList: boolean) => {
  store.dispatch(setShouldRefetchLikeList(shouldRefreshLikeList));
  store.dispatch(setShouldRefetchHistory(true));
};
