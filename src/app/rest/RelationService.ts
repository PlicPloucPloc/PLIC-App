import { Alert } from 'react-native';

import { RELATION_TYPE, RelationInfo } from '@app/definitions/rest/RelationService';

import { alertOnError, apiFetch } from './Client';
import Endpoints from './Endpoints';
import { getApartmentThumbnail } from './S3Service.ts';

export async function getAllRelationsPaginated(offset: number) {
  const response = await apiFetch(
    Endpoints.RELATIONS.GET_ALL_PAGINATED(offset),
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnError(response, 'Relation', 'getting all relations')) return;

  const relationsInfo = (await response.json()) as RelationInfo[];

  for (const relation of relationsInfo) {
    relation.apt.image_thumbnail = await getApartmentThumbnail(relation.apt);
  }

  return (await response.json()) as RelationInfo[];
}

export async function getLikedApartmentsPaginated(isFilterColoc: boolean, offset: number) {
  const response = await apiFetch(
    Endpoints.RELATIONS.GET_LIKES_PAGINATED(isFilterColoc, offset),
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnError(response, 'Relation', 'getting likes')) return;

  const relationsInfo = (await response.json()) as RelationInfo[];

  for (const relation of relationsInfo) {
    relation.apt.image_thumbnail = await getApartmentThumbnail(relation.apt);
  }

  return relationsInfo.map((relation) => relation.apt);
}

export async function getDislikedApartmentPaginated(offset: number) {
  const response = await apiFetch(
    Endpoints.RELATIONS.GET_DISLIKES_PAGINATED(offset),
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnError(response, 'Relation', 'getting dislikes')) return;

  const relationsInfo = (await response.json()) as RelationInfo[];

  return relationsInfo.map((relation) => relation.apt);
}

export async function postRelation(apartmentId: number, type: RELATION_TYPE) {
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

  return true;
}

export async function updateRelation(apartmentId: number, type: RELATION_TYPE) {
  const response = await apiFetch(
    Endpoints.RELATIONS.UPDATE_RELATION,
    {
      method: 'PUT',
      body: JSON.stringify({ aptId: apartmentId, isLike: type === RELATION_TYPE.LIKE }),
    },
    true,
  );

  if (await alertOnError(response, 'Relation', 'updating relation')) return false;

  return true;
}

export async function deleteRelation(apartmentId: number) {
  const response = await apiFetch(
    Endpoints.RELATIONS.DELETE_RELATION,
    {
      method: 'DELETE',
      body: JSON.stringify({ aptId: apartmentId }),
    },
    true,
  );

  if (response.status === 404) return true;

  if (await alertOnError(response, 'Relation', 'deleting relation')) return false;

  return true;
}
