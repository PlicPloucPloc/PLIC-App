import React, { ReactNode } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';

import BottomPopupModal from './BottomPopupModal';

type BottomPopupEditorModalProps = {
  children: ReactNode;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  title: string;
  hasChanges: () => boolean;
  handleDone: () => void;
};

export default function BottomPopuEditorModal({
  children,
  modalVisible,
  setModalVisible,
  title,
  hasChanges,
  handleDone,
}: BottomPopupEditorModalProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const isCloseApproved = () => {
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
  };

  return (
    <BottomPopupModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      title={title}
      handleAlertOnClose={{ willAlert: hasChanges, isCloseApproved }}>
      {children}

      {hasChanges() ? (
        <TouchableOpacity style={styles.buttonContainer} onPress={handleDone}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.buttonContainer, { backgroundColor: 'lightgrey' }]}
          onPress={handleDone}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      )}
    </BottomPopupModal>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    buttonContainer: {
      backgroundColor: colors.primary,
      alignItems: 'center',
      paddingVertical: 10,
      marginTop: 20,
      borderRadius: 8,
      borderWidth: 1,
      elevation: 3,
    },
    buttonText: {
      color: colors.textPrimary,
      fontWeight: '600',
      fontSize: 16,
    },
  });
