import React, { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { getAllRelationsPaginated } from '@app/rest/RelationService';
import ApartmentList from '@components/ApartmentList';
import BottomPopupModal from '@components/BottomPopupModal';
import HeaderInfoButton from '@components/HeaderInfoButton';
import { AccountStackScreenProps } from '@navigation/Types';

export default function HistoryScreen({ navigation }: AccountStackScreenProps<'History'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [modalVisible, setModalVisible] = useState(false);

  const [search, setSearch] = useState('');

  const toggleHelp = useCallback(() => {
    setModalVisible(true);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderInfoButton icon="help-circle-outline" onPress={toggleHelp} />,
    });
  }, [navigation, toggleHelp]);

  return (
    <View style={styles.container}>
      <BottomPopupModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="History of viewed apartments">
        <View>
          <Text style={{ fontSize: 16, color: colors.textPrimary }}>
            This screen shows the list of every apartments you have likes or disliked.{'\n\n'}You
            can swipe an apartment to the left on order to remove it from the history so it will
            show again in the main feed.
          </Text>
        </View>
      </BottomPopupModal>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.topContainer}>
          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchBar}
          />
        </View>
      </TouchableWithoutFeedback>

      <ApartmentList
        navigation={navigation}
        search={search}
        fetchData={(offset) => getAllRelationsPaginated(offset)}
        isHistory={true}
      />
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topContainer: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: colors.background,
    },
    searchBar: {
      padding: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 100,
      fontSize: 15,
    },
    rightAction: {
      width: 100,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    actionTouchable: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: 'red',
    },
    actionText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
