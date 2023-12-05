import React, { useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { useAuth } from '../../utils/auth';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { getAllChats } from '../../utils/apiService';
import { FlatList } from 'react-native-gesture-handler';
import Message from '../../components/Message';

export default function Messages() {
    const { isAuthenticated, token } = useAuth();
    const [chats, setChats] = useState([]);
    const { navigate } = useNavigation();

    useEffect(() => {
        if (!isAuthenticated) return navigate('login');
        (async () => {
            const fetchedChats = await getAllChats(token);
            setChats(fetchedChats.chats);
        })();
    }, [chats]);

    return (
        <>
            {chats && chats.length > 0 && (
                <FlatList
                    data={chats}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={styles.container} onPress={() => { navigate('chatView', { chat: item }) }}>
                                <Message item={item} />
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item) => item._id}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
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
    },
});