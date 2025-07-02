import { Alert } from 'react-native';

import { ApartmentInfo } from '@app/definitions';

import { apiFetch } from './Client';
import Endpoints from './Endpoints';

const S3_URL = process.env.EXPO_PUBLIC_S3_URL;

export async function getApartmentsInfoPaginated(offset: number) {
  const response = await apiFetch(
    Endpoints.APARTMENT.GET_INFO_PAGINATED(offset),
    {
      method: 'GET',
    },
    true,
  );

  if (!response.ok) {
    const errorData = await response.json();
    Alert.alert(
      'Apartment Error',
      errorData.message || 'An error occurred while fetching the apartments.',
    );
    return undefined;
  }

  const apartments: ApartmentInfo[] = await response.json();

  for (const apt of apartments) {
    apt.image_thumbnail = `${S3_URL}/apartment-pictures/${apt.apartment_id}/0.jpg`;
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

  if (!response.ok) {
    const errorData = await response.json();
    Alert.alert(
      'Apartment Error',
      errorData.message || 'An error occurred while fetching an apartment.',
    );
    return undefined;
  }

  const apartment: ApartmentInfo = await response.json();

  apartment.image_thumbnail = `${S3_URL}/apartment-pictures/${apartment.apartment_id}/0.jpg`;
  await getApartmentImages(apartment);

  return apartment;
}

export async function getApartmentImages(apt: ApartmentInfo) {
  const images_url = [apt.image_thumbnail];

  let index = 1;
  while (true) {
    const imageUrl = `${S3_URL}/apartment-pictures/${apt.apartment_id}/${index}.jpg`;
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) break; // No more images available
      images_url.push(imageUrl);
      index++;
    } catch (error) {
      break; // Error fetching image, stop the loop
    }
  }

  console.log('Fetched images:', images_url);
  return images_url;
}
