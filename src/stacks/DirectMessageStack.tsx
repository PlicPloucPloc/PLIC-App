import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface User {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
}

interface ChatHeaderProps {
  user: User;
  onBackPress: () => void;
}

const DirectMessageStack: React.FC<ChatHeaderProps> = ({ user, onBackPress }) => {
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity> */}

      <Image source={{ uri: user.avatar }} style={styles.avatar} />

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingTop: 50, // Pour le status bar
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333333',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 24,
    color: '#666666',
  },
});

export default DirectMessageStack;
export type { User };
// import React from 'react';
// import { View, Text, Image, StyleSheet } from 'react-native';

// type DirectMessageProps = {
//   name: string;
//   avatar: string;
// };

// export default function DirectMessageStack({ name, avatar }: DirectMessageProps) {
//   return (
//     <View style={styles.header}>
//       <Image source={{ uri: avatar }} style={styles.avatar} />
//       <Text style={styles.userName}>{name}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     position: 'absolute',
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//     backgroundColor: '#f9f9f9',
//     paddingTop: 50,
//     zIndex: 1, // pour s'assurer qu'il reste au-dessus
//     width: '100%',
//   },
//   avatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     marginRight: 10,
//   },
//   userName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
