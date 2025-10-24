import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { setBirthdate } from '@app/redux/slices';
import store from '@app/redux/Store';

export function checkEmail(email: string): string {
  if (!email) {
    return 'Email cannot be empty.';
  }

  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!regex.test(email)) {
    return 'Invalid email format.';
  }

  return '';
}

export function checkPassword(password: string, isRegistering = false): string {
  if (!password) {
    return 'Password cannot be empty.';
  }

  // the cehck below are done only if the user is registering
  if (!isRegistering) {
    return '';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  let regex = /^(.*[0-9].*)$/;
  if (!regex.test(password)) {
    return 'Password must contain at least one number.';
  }

  regex = /^(.*[-!@#$%_^&*].*)$/;
  if (!regex.test(password)) {
    return 'Password must contain at least one special character.';
  }

  return '';
}

export function showBirthdatePicker(
  date: Date | null,
  setDate: (date: Date) => void,
  publishToStore = true,
) {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13); // 13 years old minimum to register

  DateTimePickerAndroid.open({
    value: date || new Date(),
    onChange: (_, selectedDate) => {
      if (!selectedDate) return;

      setDate(selectedDate);
      if (publishToStore) {
        store.dispatch(setBirthdate(selectedDate.toISOString()));
      }
    },
    mode: 'date',
    maximumDate: maxDate,
    minimumDate: new Date(1900, 0, 1, 1), // Set to 1900
  });
}
