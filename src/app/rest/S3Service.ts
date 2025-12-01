import { Alert } from 'react-native';

import { S3_URL } from '@app/config/Env';
import { ApartmentInfo } from '@app/definitions';
import { alertOnResponseError } from '@app/utils/Error';

import { apiFetch, fetchWithTimeout } from './Client';

export async function postProfilePictureFromSignedUrl(
  path: string,
  token: string,
  image: Blob,
): Promise<Response> {
  return fetch(`${S3_URL}/upload/sign/user-pictures/${path}?token=${token}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: image,
  });
}

export async function checkProfilePictureExists(userId: string): Promise<string | null> {
  const imageUrl = `${S3_URL}/user-pictures/${userId}.jpeg`;
  return (await checkImageExists(imageUrl)) ? imageUrl : null;
}

export async function putProfilePicture(userId: string, image: Blob): Promise<void> {
  const response = await apiFetch(
    `${S3_URL}/user-pictures/${userId}.jpeg`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: image,
    },
    true,
    '',
  );

  alertOnResponseError(response, 'S3', 'updating profile picture');
}

export async function deleteProfilePicture(userId: string): Promise<void> {
  const response = await apiFetch(
    `${S3_URL}/user-pictures/${userId}.jpeg`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'image/jpeg',
      },
    },
    true,
    '',
  );

  alertOnResponseError(response, 'S3', 'deleting profile picture');
}

export async function getApartmentThumbnail(apt: ApartmentInfo): Promise<string> {
  const thumbnailUrl = `${S3_URL}/public/apartment-pictures/${apt.apartment_id}/0.jpeg`;

  if (await checkImageExists(thumbnailUrl)) {
    return thumbnailUrl;
  } else {
    console.warn(`Thumbnail not found for apartment: ${apt.apartment_id}`);
    return 'https://http.dog/404.jpg'; // Fallback image
  }
}

export async function getApartmentImages(apt: ApartmentInfo) {
  if (!apt.image_thumbnail) {
    apt.image_thumbnail = await getApartmentThumbnail(apt);
  }

  const images_url: string[] = [apt.image_thumbnail];

  let index = 1;
  while (true) {
    const imageUrl = `${S3_URL}/public/apartment-pictures/${apt.apartment_id}/${index}.jpeg`;
    const exists = await checkImageExists(imageUrl);
    if (!exists) {
      break;
    }

    images_url.push(imageUrl);
    index++;
  }

  return images_url;
}

async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(url, { method: 'HEAD' });
    return response.ok;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`Request timed out while checking image: ${url}`);
      Alert.alert('Image Fetch Error', `Failed to check image. The request timed out.`);
    } else {
      console.error(`Failed to check image: ${url}`, error);
    }
    return false;
  }
}
