import { Alert } from 'react-native';

export function alertUnsaveChangesAsync() {
  return new Promise<boolean>((resolve) => {
    Alert.alert(
      'Unsaved changes',
      'You have unsaved changes. Are you sure you want to discard them?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Discard', style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

export function CalculateAge(birthdate: string): number {
  return Math.floor((new Date().getTime() - new Date(birthdate).getTime()) / 31557600000);
}
