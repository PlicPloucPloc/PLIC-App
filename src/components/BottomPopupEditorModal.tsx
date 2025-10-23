import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { alertUnsaveChangesAsync } from '@app/utils/Misc';

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

  return (
    <BottomPopupModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      title={title}
      handleAlertOnClose={{ willAlert: hasChanges, isCloseApproved: alertUnsaveChangesAsync }}>
      {children}

      {hasChanges() ? (
        <TouchableOpacity style={styles.button} onPress={handleDone}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'lightgrey' }]}
          onPress={handleDone}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      )}
    </BottomPopupModal>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    button: {
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
