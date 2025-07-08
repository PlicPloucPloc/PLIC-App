import React, { useState, useRef, useEffect } from 'react';

import DirectMessageStack, { User } from '@stacks/DirectMessageStack';

import { AntDesign, Ionicons } from '@expo/vector-icons';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ListRenderItem,
} from 'react-native';

interface Message {
  id: number;
  text: string;
  isMe: boolean;
  timestamp: string;
}

const mockUsers: User[] = [
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

const DirectMessageScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      isMe: false,
      timestamp: '14:30',
    },
    {
      id: 2,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a dapibus dolor. Ut in pharetra tortor. Aenean sed risus gravida, dictum',
      isMe: true,
      timestamp: '14:31',
    },
    {
      id: 3,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a dapibus dolor. Ut in pharetra tortor. Aenean sed risus gravida, dictum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a dapibus dolor. Ut in pharetra tortor. Aenean sed risus gravida, dictum purus tincidunt, luctus est. Praesent sit amet sapien semper, varius ex eu, vehicula felis',
      isMe: true,
      timestamp: '14:32',
    },
    {
      id: 4,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a dapibus dolor. Ut in pharetra tortor. Aenean sed risus gravida, dictum',
      isMe: false,
      timestamp: '14:33',
    },
    {
      id: 5,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      isMe: true,
      timestamp: '14:34',
    },
    {
      id: 6,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      isMe: false,
      timestamp: '14:35',
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const flatListRef = useRef<FlatList<Message>>(null);
  const currentUser: User = mockUsers[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  const handleSend = (): void => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputText,
        isMe: true,
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage: ListRenderItem<Message> = ({ item }) => (
    <View style={[styles.messageContainer, item.isMe ? styles.myMessage : styles.otherMessage]}>
      <View style={[styles.messageBubble, item.isMe ? styles.myBubble : styles.otherBubble]}>
        <Text
          style={[styles.messageText, item.isMe ? styles.myMessageText : styles.otherMessageText]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <DirectMessageStack
        user={currentUser}
        onBackPress={(): void => console.log('Back pressed')}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <AntDesign name="picture" size={28} color="black" />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Entrer text to chat..."
          multiline
        />

        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  attachIcon: {
    width: 24,
    height: 24,
    tintColor: '#666666',
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  sendIcon: {
    fontSize: 24,
    color: '#007AFF',
  },
});

export default DirectMessageScreen;
// import React, { useEffect, useRef, useState } from 'react';
// import DirectMessageStack from '@stacks/DirectMessageStack';
// import {
//   FlatList,
//   Image,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import { AntDesign, Ionicons } from '@expo/vector-icons';
// import { SharedStackScreenProps } from '@navigation/Types';
// import { useHeaderHeight } from '@react-navigation/elements';

// const mockUsers = [
//   {
//     id: 1,
//     name: 'Jean Baptiste',
//     avatar: 'https://i.pravatar.cc/100?img=1',
//     lastMessage: 'Comment va-t-on sortir de là...',
//   },
//   {
//     id: 2,
//     name: 'Marie Claire',
//     avatar: 'https://i.pravatar.cc/100?img=2',
//     lastMessage: 'Évidemment !',
//   },
//   {
//     id: 3,
//     name: 'Michel',
//     avatar: 'https://i.pravatar.cc/100?img=3',
//     lastMessage: 'Ca me va :)',
//   },
// ];

// export default function DirectMessageScreen({
//   route,
//   navigation,
// }: SharedStackScreenProps<'DirectMessage'>) {
//   const { userId } = route.params;
//   const user = mockUsers.find((u) => u.id === userId)!;
//   const [messages, setMessages] = useState<any[]>([]);
//   const [input, setInput] = useState('');
//   const flatListRef = useRef<FlatList>(null);

//   useEffect(() => {
//     navigation.setOptions({ title: user.name });
//     setMessages([
//       {
//         id: 'initial',
//         text: user.lastMessage,
//         sender: 'other',
//         timestamp: '10:00',
//       },
//     ]);
//   }, [navigation, user.name, user.lastMessage]);
//   const [keyboardHeight, setKeyboardHeight] = useState(0);
//   const [data, setData] = useState(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`));

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
//       setKeyboardHeight(e.endCoordinates.height);
//     });
//     const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
//       setKeyboardHeight(0);
//     });

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   const handleSend = () => {
//     if (!input.trim()) return;
//     const newMessage = {
//       id: Date.now().toString(),
//       text: input,
//       sender: 'me',
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     };
//     setMessages((prev) => [newMessage, ...prev]);
//     setInput('');
//     //scrollToBottom();
//   };

//   const handleSendImage = () => {
//     // const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
//     // if (!result.canceled && result.assets.length > 0) {
//     //   const newMessage = {
//     //     id: Date.now().toString(),
//     //     imageUri: result.assets[0].uri,
//     //     sender: 'me',
//     //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     //   };
//     //   setMessages((prev) => [...prev, newMessage]);
//     //   scrollToBottom();
//     //}
//   };

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       flatListRef.current?.scrollToEnd({ animated: true });
//     }, 100);
//   };

//   const renderItem = ({ item }: any) => (
//     <View
//       style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.theirMessage]}>
//       {item.text && <Text style={styles.messageText}>{item.text}</Text>}
//       {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.image} />}
//       <Text style={styles.timestamp}>{item.timestamp}</Text>
//     </View>
//   );
//   const headerHeight = useHeaderHeight();
//   return (
//     // <KeyboardAvoidingView
//     // style={[styles.container, { paddingTop: headerHeight }]}
//     //   behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     // >
//     <View style={styles.container}>

//       <DirectMessageStack name={user.name} avatar={user.avatar} />
//         <View style={[styles.flex, { marginBottom: keyboardHeight }]}>
//           <FlatList
//             ref={flatListRef}
//             inverted
//             data={messages}
//             keyExtractor={(item) => item.id}
//             renderItem={renderItem}
//             contentContainerStyle={[
//               styles.messageList,
//               { paddingBottom: 90 + keyboardHeight },
//             ]}

//             keyboardShouldPersistTaps="handled"
//           />
//           </View>
//           <View style={styles.inputContainer}>
//             <TouchableOpacity onPress={handleSendImage} style={styles.imageButton}>
//               <AntDesign name="picture" size={28} color="black" />
//             </TouchableOpacity>
//             <TextInput
//               style={styles.input}
//               value={input}
//               onChangeText={setInput}
//               placeholder="Écrire un message"
//             />
//             <TouchableOpacity onPress={handleSend}>
//               <Ionicons name="send" size={24} color="black" />
//             </TouchableOpacity>

//         </View>
//         </View>
//     //</KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   flex: {
//     flex: 1,
//   },
//   header: {
//     position:'absolute',
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//     backgroundColor: '#f9f9f9',
//     paddingTop: 50,
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
//   messageList: {
//     padding: 16,
//     paddingBottom: 90,
//   },
//   messageBubble: {
//     marginBottom: 12,
//     padding: 10,
//     borderRadius: 10,
//     maxWidth: '80%',
//   },
//   myMessage: {
//     backgroundColor: '#DCF8C6',
//     alignSelf: 'flex-end',
//   },
//   theirMessage: {
//     backgroundColor: '#f0f0f0',
//     alignSelf: 'flex-start',
//   },
//   messageText: {
//     fontSize: 16,
//   },
//   timestamp: {
//     fontSize: 10,
//     color: '#666',
//     marginTop: 4,
//     alignSelf: 'flex-end',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     paddingBottom: 10,
//     borderTopWidth: 1,
//     borderColor: '#ddd',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   imageButton: {
//     padding: 6,
//     marginRight: 6,
//   },
//   imageText: {
//     fontSize: 20,
//   },
//   input: {
//     backgroundColor: '#f5f5f5',
//     padding: 10,
//     borderRadius: 20,
//     marginRight: 8,
//     flex: 1,
//   },
//   sendButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//   },
//   sendText: {
//     color: 'white',
//     fontWeight: '600',
//   },
//   image: {
//     width: 200,
//     height: 150,
//     borderRadius: 8,
//     marginTop: 5,
//   },
// });
