import { ReactNode, useCallback } from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';

export type BottomPopupModalProps = {
  children: ReactNode;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  title: string;
  subtitle?: string;
  handleAlertOnClose?: { willAlert: () => boolean; isCloseApproved: () => Promise<boolean> };
};

export default function BottomPopupModal({
  children,
  modalVisible,
  setModalVisible,
  title,
  subtitle,
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
        <View style={styles.container}>
          <View style={styles.swipeIndicator} />

          <View style={styles.headerContainer}>
            <Ionicons
              name="close"
              size={26}
              color={colors.textPrimary}
              onPress={() => handleClose(true)}
            />
            <Text style={styles.title}>{title}</Text>
            <Ionicons name="close" size={24} style={{ opacity: 0 }} />
          </View>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {children}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
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
    swipeIndicator: {
      width: '10%',
      height: 5,
      backgroundColor: colors.contrast,
      borderRadius: 5,
      alignSelf: 'center',
      marginBottom: 15,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 23,
      textAlign: 'center',
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 15,
      textAlign: 'center',
    },
  });
