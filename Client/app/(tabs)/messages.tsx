import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from 'expo-router';
import { useAuth } from '../../utils/auth';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { getAllChats } from '../../utils/apiService';
import { FlatList } from 'react-native-gesture-handler';
import { Swipeable } from 'react-native-gesture-handler';
import Message from '../../components/Message';

export default function Messages() {
  const { isAuthenticated, token } = useAuth();
  const [chats, setChats] = useState([]);
  const { navigate } = useNavigation();
  const [swipedMessageId, setSwipedMessageId] = useState(null);
  const swipeableRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return navigate('login');
    (async () => {
      const fetchedChats = await getAllChats(token);
      setChats(fetchedChats.chats);
    })();
  }, [isAuthenticated, token]);

  const handleDelete = (messageId) => {
    setChats((prevChats) => prevChats.filter((chat) => chat._id !== messageId));
    setSwipedMessageId(null);
  };

  const renderSwipeDelete = (onPress) => (
    <View style={{ width: 70, justifyContent: 'center', alignItems: 'center', backgroundColor: '#b0221d', borderRadius: 5, height: 60, marginTop: 15, marginRight: 10, }}>
      <TouchableOpacity onPress={onPress}>
        <Text style={{ color: 'white', fontSize: 16 }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderSwipeDelete(() => handleDelete(item._id))}
      onSwipeableOpen={() => setSwipedMessageId(item._id)}
      onSwipeableClose={() => setSwipedMessageId(null)}
      ref={swipeableRef}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigate('chatView', { chat: item })}
        activeOpacity={1} // This makes sure that TouchableOpacity doesn't interfere with Swipeable
      >
        <Message item={item} />
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <>
      {chats.length > 0 && (
        <FlatList
          data={chats}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    marginTop: 10,
    marginBottom: 5,
  },
});

