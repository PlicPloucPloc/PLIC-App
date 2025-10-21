import { useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { showBirthdatePicker } from '@app/utils/Auth';
import Loader from '@components/Loader';
import { useSelector } from 'react-redux';

import BottomPopuEditorModal from './BottomPopupEditorModal';

type EditProfileInformationModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export default function EditProfileInformationModal({
  modalVisible,
  setModalVisible,
}: EditProfileInformationModalProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [isLoading, setIsLoading] = useState(false);
  const authState = useSelector((state: RootState) => state.authState);

  const [firstName, setFirstName] = useState(authState.firstName);
  const [lastName, setLastName] = useState(authState.lastName);
  const [birthdate, setBirthdate] = useState<Date>(new Date(authState.birthdate));

  const [originalFields, setOriginalFields] = useState({
    firstName: authState.firstName,
    lastName: authState.lastName,
    birthdate: new Date(authState.birthdate),
  });

  useEffect(() => {
    if (!modalVisible) {
      return;
    }

    const date = new Date(authState.birthdate);

    setFirstName(authState.firstName);
    setLastName(authState.lastName);
    setBirthdate(date);
    setOriginalFields({
      firstName: authState.firstName,
      lastName: authState.lastName,
      birthdate: date,
    });
  }, [modalVisible, authState]);

  const hasChanges = () =>
    firstName !== originalFields.firstName ||
    lastName !== originalFields.lastName ||
    birthdate.getTime() !== originalFields.birthdate.getTime();

  async function handleDone() {
    if (!firstName || !lastName || !birthdate) {
      return Alert.alert('Error', 'Please fill in all fields.');
    }

    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (!hasChanges()) {
      return setModalVisible(false);
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)).finally(() => setIsLoading(false)); // simulate api call
    //TODO:
    // api call to update profile information
    // dispatch indo to store

    setModalVisible(false);

    Alert.alert(
      'Not implemented',
      'Editing profile information is not implemented yet.\nYou just witnessed a demo :)',
    );
  }

  return (
    <BottomPopuEditorModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      title={'Edit personal information'}
      hasChanges={hasChanges}
      handleDone={handleDone}>
      <Loader loading={isLoading} />

      <View style={styles.inputsContainer}>
        <TextInput
          placeholder="First Name"
          placeholderTextColor={colors.textSecondary}
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="next"
          autoFocus={true}
        />
        <TextInput
          placeholder="Last Name"
          placeholderTextColor={colors.textSecondary}
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="next"
        />
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            showBirthdatePicker(birthdate, setBirthdate, false);
          }}
          style={{ width: '100%' }}>
          <TextInput
            style={styles.input}
            placeholder="Date of birth"
            placeholderTextColor={colors.textSecondary}
            editable={false}
            value={birthdate?.toLocaleDateString()}
            pointerEvents="none"
          />
        </TouchableOpacity>
      </View>
    </BottomPopuEditorModal>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    inputsContainer: {
      width: '100%',
      alignItems: 'center',
      gap: 20,
    },
    input: {
      width: '100%',
      padding: 12,
      borderWidth: 1,
      borderColor: colors.contrast,
      borderRadius: 10,
      fontSize: 16,
      color: colors.textPrimary,
    },
  });
