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
  sender: User;
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

const GroupInfoScreen: React.FC = () => {
  const currentUser: User = mockUsers[0];
  const [inputText, setInputText] = useState<string>('');
  const flatListRef = useRef<FlatList<Message>>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Salut à tous !',
      isMe: false,
      timestamp: '14:30',
      sender: mockUsers[1],
    },
    {
      id: 2,
      text: 'Hello Marie Claire :)',
      isMe: true,
      timestamp: '14:31',
      sender: currentUser,
    },
    {
      id: 3,
      text: 'On commence quand ?',
      isMe: false,
      timestamp: '14:32',
      sender: mockUsers[2],
    },
    {
      id: 4,
      text: 'Maintenant si vous êtes prêts',
      isMe: true,
      timestamp: '14:33',
      sender: currentUser,
    },
  ]);

  const scrollToBottom = (): void => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSend = (): void => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputText,
        isMe: true,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        sender: currentUser,
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage: ListRenderItem<Message> = ({ item }) => {
    const isMe = item.isMe;

    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
        {!isMe && (
          <View style={styles.senderInfo}>
            <Image source={{ uri: item.sender.avatar }} style={styles.avatar} />
            <Text style={styles.senderName}>{item.sender.name}</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <DirectMessageStack 
        user={currentUser} 
        onBackPress={() => console.log('Back pressed')} 
      />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <AntDesign name="picture" size={28} color="black" />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Entrer un message..."
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
    marginVertical: 8,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
  },
  senderName: {
    fontWeight: '600',
    color: '#333',
  },
  messageBubble: {
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
});

export default GroupInfoScreen;

// import React from 'react';
// import { Button, StyleSheet, Text, View } from 'react-native';

// import { MessageStackScreenProps } from '@navigation/Types';

// export default function GroupInfoScreen({
//   navigation,
//   route,
// }: MessageStackScreenProps<'GroupInfo'>) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Info of group {route.params.groupId}</Text>
//       <Button
//         title="See profil of user 1"
//         onPress={() =>
//           navigation.navigate('SharedStack', {
//             screen: 'OtherProfil',
//             params: { userId: 1 },
//           })
//         }
//       />
//       <Button
//         title="See profil of user 2"
//         onPress={() =>
//           navigation.navigate('SharedStack', {
//             screen: 'OtherProfil',
//             params: { userId: 2 },
//           })
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
// });
