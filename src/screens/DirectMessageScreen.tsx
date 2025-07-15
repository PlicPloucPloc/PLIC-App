import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import MessageHeader, { User } from '@components/MessageHeader';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface Message {
  id: number;
  text: string; // devient optionnel
  imageUri?: string; // nouvelle propriété
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

export default function DirectMessageScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour, j'aime beaucoup votre appart",
      isMe: true,
      timestamp: '14:30',
    },
    {
      id: 2,
      text: 'Merci',
      isMe: false,
      timestamp: '14:31',
    },
    {
      id: 3,
      text: 'Est-ce que les voisins font du bruit ?',
      isMe: true,
      timestamp: '14:32',
    },
    {
      id: 4,
      text: 'Non',
      isMe: false,
      timestamp: '14:33',
    },
    {
      id: 5,
      text: "Je peux venir visiter l'appart demain ?",
      isMe: true,
      timestamp: '14:34',
    },
    {
      id: 6,
      text: 'Evidemment !',
      isMe: false,
      timestamp: '14:35',
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const flatListRef = useRef<FlatList<Message>>(null);
  const currentUser: User = mockUsers[1];

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

  const renderMessage = ({ item }: { item: Message }) => {
    const isImage = item.text.startsWith('file://');

    return (
      <View
        style={[
          styles.messageContainer,
          item.isMe ? styles.myMessage : styles.otherMessage,
          { alignItems: item.isMe ? 'flex-end' : 'flex-start', marginVertical: 4 },
        ]}>
        {isImage ? (
          <Image
            source={{ uri: item.text }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 10,
            }}
          />
        ) : (
          <View
            style={[
              styles.messageBubble,
              item.isMe ? styles.myBubble : styles.otherBubble,
              { maxWidth: '80%' },
            ]}>
            <Text
              style={[
                styles.messageText,
                item.isMe ? styles.myMessageText : styles.otherMessageText,
              ]}>
              {item.text}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const sendImage = async () => {
    // Demander la permission d'accéder à la galerie
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission requise pour accéder à la galerie !');
      return;
    }

    // Ouvrir la galerie pour sélectionner une image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;

      const newMessage: Message = {
        id: messages.length + 1,
        text: selectedImageUri, // on stocke l'URI de l'image
        isMe: true,
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages([...messages, newMessage]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <MessageHeader user={currentUser} onBackPress={(): void => console.log('Back pressed')} />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        // onContentSizeChange={scrollToBottom}
        // onLayout={scrollToBottom}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={sendImage} style={styles.attachButton}>
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
}

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
