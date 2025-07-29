import React, { useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { getLikedApartmentsPaginated } from '@app/rest/RelationService';
import ApartmentList from '@components/ApartmentList';
import { LikesStackScreenProps } from '@navigation/Types';

export default function LikesListScreen({ navigation }: LikesStackScreenProps<'LikesList'>) {
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
        fetchData={(offset, pageSize) => getLikedApartmentsPaginated(true, offset, pageSize)}
        isHistory={false}
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
  });
