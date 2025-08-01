import { API_PAGE_SIZE } from '@app/config/constants.ts';
import { ApartmentInfo } from '@app/definitions';

import { alertOnError, apiFetch } from './Client';
import Endpoints from './Endpoints';
import { getApartmentImages, getApartmentThumbnail } from './S3Service.ts';

export async function getApartmentsInfoPaginated(offset: number, pageSize: number = API_PAGE_SIZE) {
  const response = await apiFetch(
    Endpoints.APARTMENT.GET_INFO_PAGINATED(offset, pageSize),
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnError(response, 'Apartment', 'fetching the apartments')) return;

  const apartments: ApartmentInfo[] = await response.json();

  for (const apt of apartments) {
    apt.image_thumbnail = await getApartmentThumbnail(apt);
  }

  return apartments;
}

export async function getApartmentsNoRelationPaginated(
  offset: number,
  pageSize: number = API_PAGE_SIZE,
) {
  const response = await apiFetch(
    Endpoints.APARTMENT.NO_RELATIONS_PAGINATED(offset, pageSize),
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnError(response, 'Apartment', 'fetching apartments without relations')) return [];

  const apartments: ApartmentInfo[] = await response.json();

  for (const apt of apartments) {
    apt.image_thumbnail = await getApartmentThumbnail(apt);
  }

  return apartments;
}

export async function getApartmentInfoById(id: number) {
  const response = await apiFetch(
    Endpoints.APARTMENT.GET_INFO_BY_ID(id),
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnError(response, 'Apartment', 'fetching an apartment')) return;

  const apartment: ApartmentInfo = await response.json();

  apartment.image_thumbnail = (await getApartmentThumbnail(apartment)) ?? '';

  await getApartmentImages(apartment);

  return apartment;
}
