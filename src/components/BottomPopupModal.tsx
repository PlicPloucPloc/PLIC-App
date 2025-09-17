import { ReactNode, useCallback } from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

export type BottomPopupModalProps = {
  children: ReactNode;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  title: string;
  handleAlertOnClose?: { willAlert: () => boolean; isCloseApproved: () => Promise<boolean> };
};

export default function BottomPopupModal({
  children,
  modalVisible,
  setModalVisible,
  title,
  handleAlertOnClose,
}: BottomPopupModalProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const handleClose = useCallback(
    async (waitForDismiss = true) => {
      if (handleAlertOnClose?.willAlert()) {
        if (Keyboard.isVisible()) {
          Keyboard.dismiss();
        }

        const closeApproved = await handleAlertOnClose.isCloseApproved();
        if (!closeApproved) {
          return;
        }
      }

      if (Keyboard.isVisible()) {
        Keyboard.dismiss();
        if (waitForDismiss) {
          await new Promise((resolve) => setTimeout(resolve, 100)); // better feeling
        }
      }
      setModalVisible(false);
    },
    [setModalVisible, handleAlertOnClose],
  );

  return (
    <Modal
      isVisible={modalVisible}
      onBackdropPress={() => handleClose(true)}
      onBackButtonPress={() => handleClose(true)}
      hideModalContentWhileAnimating={true}
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionOutTiming={1}
      backdropTransitionInTiming={1}
      backdropOpacity={0}
      swipeDirection={['down']}
      onSwipeComplete={() => handleClose(false)}
      style={{ margin: 0 }}>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={styles.modalView}>
          <View style={styles.modalSwipeIndicator} />

          <View style={styles.modalHeaderContainer}>
            <Ionicons
              name="close"
              size={26}
              color={colors.textPrimary}
              onPress={() => handleClose(true)}
            />
            <Text style={styles.modalTitle}>{title}</Text>
            <Ionicons name="close" size={24} style={{ opacity: 0 }} />
          </View>

          {children}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    modalView: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '100%',
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: 20,
      paddingBottom: 30,
      paddingTop: 5,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
    modalSwipeIndicator: {
      width: '10%',
      height: 5,
      backgroundColor: colors.contrast,
      borderRadius: 5,
      alignSelf: 'center',
      marginBottom: 15,
    },
    modalHeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    modalTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 23,
      textAlign: 'center',
    },
  });
