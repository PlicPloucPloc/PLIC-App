import React, { useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { getAllRelationsPaginated } from '@app/rest/RelationService';
import ApartmentList from '@components/ApartmentList';
import { ProfilStackScreenProps } from '@navigation/Types';

export default function HistoryScreen({ navigation }: ProfilStackScreenProps<'History'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
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
