import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../utils/auth';
import * as icons from '@expo/vector-icons';
import { useChat } from '../utils/chat';


const Message = ({ item }) => {
    const { user } = useAuth();
    const { setName, setImageUrl } = useChat();
    const name = item.driver.userId === user.userId ? item.passenger.name : item.driver.name;
    const imageUrl = item.driver.userId === user.userId ? item.passenger.imageUrl : item.driver.imageUrl;
    const lastMessage = item.chat.length > 0 && item.chat[item.chat.length - 1].message.content;

    useEffect(() => {
        setName(name);
        setImageUrl(imageUrl);
    }, []);

    return (
        <View style={[styles.message, { justifyContent: 'space-between' }]}>
            <View style={styles.message}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <icons.AntDesign name="user" size={40} color="black" />
                )}
                {lastMessage ? (
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: '600' }}>{name}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '300', fontStyle: 'italic' }}>{lastMessage.length >= 35 ? lastMessage.substring(0, 32) + '...' : lastMessage}</Text>
                    </View>
                ) : (
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: '600' }}>{name}</Text>
                    </View>
                )}
            </View>
        </View>
    )
}

export default Message;

const styles = StyleSheet.create({
    message: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 15,
    },
    image: {
        height: 50,
        width: 50,
        padding: 8,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: '#000',
    },

});