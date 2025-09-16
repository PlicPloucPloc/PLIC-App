import { Alert } from 'react-native';

export async function alertOnResponseError(response: Response, service: string, message: string) {
  const hasError = !response.ok;

  if (hasError) {
    const errorData = await response.json();
    Alert.alert(`${service} Error`, errorData.message || `An error occurred while ${message}.`);
  }

  return hasError;
}
