import React, { useState, useEffect } from 'react';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useAuth } from '../../utils/auth';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { getAllChats, getDriver } from '../../utils/apiService';
import { FlatList } from 'react-native-gesture-handler';
import Message from '../../components/Message';

export default function Messages() {
    const { isAuthenticated, token } = useAuth();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) return navigate('login');
        (async () => {
            const fetchedChats = await getAllChats(token);
            setChats(fetchedChats.chats); // Extracting chats array from the fetched object
        })();
    }, [isAuthenticated, token]);

    return (
        <View style={styles.scrollContainer}>
            {chats.length > 0 && (
                <FlatList
                    data={chats}
                    renderItem={({ item }) => {
                        return (
                            <Message item={item} />
                        )
                    }}
                    keyExtractor={(item) => item._id}
                />
            )}
        </View>
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
