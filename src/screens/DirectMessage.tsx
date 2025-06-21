import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  StatusBar
  
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SharedStackScreenProps } from '@navigation/Types';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
const mockUsers = [
  {
    id: 1,
    name: 'Jean Baptiste',
    avatar: 'https://i.pravatar.cc/100?img=1',
    lastMessage: 'Comment va-t-on sortir de là...',
  },
  {
    id: 2,
    name: 'Marie Claire',
    avatar: 'https://i.pravatar.cc/100?img=2',
    lastMessage: 'Évidemment !',
  },
  {
    id: 3,
    name: 'Michel',
    avatar: 'https://i.pravatar.cc/100?img=3',
    lastMessage: 'Ca me va :)',
  },
];


export default function DirectMessageScreen({
  route,
  navigation,
}: SharedStackScreenProps<'DirectMessage'>) {
  const { userId } = route.params;
  const user = mockUsers.find((u) => u.id === userId)!;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({ title: user.name });
    setMessages([
      {
        id: 'initial',
        text: user.lastMessage,
        sender: 'other',
        timestamp: '10:00',
      },
    ]);
  }, [userId]);

// const [keyboardVisible, setKeyboardVisible] = useState(false);

// useEffect(() => {
//   const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
//     setKeyboardVisible(true);
//   });
//   const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
//     setKeyboardVisible(false);
//   });

//   return () => {
//     showSubscription.remove();
//     hideSubscription.remove();
//   };
// }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [newMessage, ...prev]);
    setInput('');
    //scrollToBottom();
  };

  const handleSendImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled && result.assets.length > 0) {
      const newMessage = {
        id: Date.now().toString(),
        imageUri: result.assets[0].uri,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myMessage : styles.theirMessage,
      ]}
    >
      {item.text && <Text style={styles.messageText}>{item.text}</Text>}
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.image} />
      )}
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );
  const headerHeight = useHeaderHeight();
  return (
  
    <SafeAreaView style={[styles.container, { paddingTop: headerHeight }]}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{user.name}</Text>
      </View>
  
   <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
    >
      <View style={styles.flex}>
        <FlatList
          ref={flatListRef}
          inverted
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled"
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={handleSendImage} style={styles.imageButton}>
            <AntDesign name="picture" size={28} color="black" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Écrire un message"
          />
          <TouchableOpacity onPress={handleSend}>
            <Ionicons name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      
    },
    flex: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderColor: '#eee',
      backgroundColor: '#f9f9f9',
      paddingTop: 50,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 10,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    messageList: {
      padding: 16,
      paddingBottom: 90, 
    },
    messageBubble: {
      marginBottom: 12,
      padding: 10,
      borderRadius: 10,
      maxWidth: '80%',
    },
    myMessage: {
      backgroundColor: '#DCF8C6',
      alignSelf: 'flex-end',
    },
    theirMessage: {
      backgroundColor: '#f0f0f0',
      alignSelf: 'flex-start',
    },
    messageText: {
      fontSize: 16,
    },
    timestamp: {
      fontSize: 10,
      color: '#666',
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      paddingBottom: 10,
      borderTopWidth: 1,
      borderColor: '#ddd',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    imageButton: {
      padding: 6,
      marginRight: 6,
    },
    imageText: {
      fontSize: 20,
    },
    input: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 10,
      borderRadius: 20,
      marginRight: 8,
    },
    sendButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    sendText: {
      color: 'white',
      fontWeight: '600',
    },
    image: {
      width: 200,
      height: 150,
      borderRadius: 8,
      marginTop: 5,
    },
  });
  