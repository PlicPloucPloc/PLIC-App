import { Alert } from 'react-native';

import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { alertOnResponseError } from './Error';

export async function fetchAndCompressImage(
  imageUri: string,
): Promise<{ uri: string; blob: Blob } | null> {
  // Convert image to PNG
  const imageRef = await ImageManipulator.manipulate(imageUri).renderAsync();

  const manipResult = await imageRef.saveAsync({
    compress: 0.4,
    format: SaveFormat.PNG,
  });

  imageUri = manipResult.uri;

  // fetch profile picture from local uri
  const imageResponse = await fetch(imageUri);

  if (await alertOnResponseError(imageResponse, 'User', 'Error fetching profile picture')) {
    return null;
  }

  const imageBlob = await imageResponse.blob();
  if (!imageBlob) {
    console.error('Error converting profile picture to blob');
    return null;
  }

  return { uri: imageUri, blob: imageBlob };
}

export async function selectImageFromMedia(
  source: 'camera' | 'gallery',
  onImageSelected: (uri: string) => Promise<void>,
) {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert('Permission required', `Please allow access to your ${source}.`);
    return;
  }

  const pickerMethod =
    source === 'camera' ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;

  const result = await pickerMethod({
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled) {
    return;
  }

  const uri = result.assets[0].uri;
  await onImageSelected(uri);
}
