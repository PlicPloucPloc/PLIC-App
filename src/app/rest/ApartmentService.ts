import { API_PAGE_SIZE } from '@app/config/Constants.ts';
import { ApartmentInfo, FiltersState } from '@app/definitions';
import { alertOnResponseError } from '@app/utils/Error.ts';

import { apiFetch } from './Client';
import Endpoints from './Endpoints';
import { getApartmentImages, getApartmentThumbnail } from './S3Service.ts';
import { filtersToQueryString } from './Utils.ts';

export async function getApartmentsNoRelationPaginated(
  offset: number,
  filters: FiltersState,
  pageSize: number = API_PAGE_SIZE,
): Promise<ApartmentInfo[]> {
  const response = await apiFetch(
    Endpoints.APARTMENT.NO_RELATIONS_PAGINATED(offset, pageSize, filtersToQueryString(filters)),
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnResponseError(response, 'Apartment', 'fetching apartments without relations')) {
    return [];
  }

  const apartments: ApartmentInfo[] = await response.json();

  for (const apt of apartments) {
    apt.image_thumbnail = await getApartmentThumbnail(apt);
  }

  return apartments;
}

export async function getApartmentInfoById(id: number): Promise<ApartmentInfo | undefined> {
  const response = await apiFetch(
    Endpoints.APARTMENT.GET_INFO_BY_ID(id),
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnResponseError(response, 'Apartment', 'fetching an apartment')) {
    return;
  }

  const apartment: ApartmentInfo = await response.json();

  apartment.image_thumbnail = (await getApartmentThumbnail(apartment)) ?? '';

  await getApartmentImages(apartment);

  return apartment;
}
