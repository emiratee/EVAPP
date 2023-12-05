import { StyleSheet, ScrollView, View, Text } from 'react-native';
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

const ChatBody = ({ messages }) => {
  const scrollViewRef = useRef();

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={{ backgroundColor: '#fbfafc', flex: 1, marginBottom: 70 }}
        contentContainerStyle={styles.scrollViewContent}
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </ScrollView>
    </View>
  );
};

export default ChatBody;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
