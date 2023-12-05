import React, { useState } from 'react';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useAuth } from '../../utils/auth';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import Message from '../../components/Message';


export default function messages() {
    const { isAuthenticated, user } = useAuth();
    const { navigate } = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            if (!isAuthenticated) {
                navigate('login');
            }
        }, [isAuthenticated])
    );



    return (
        <ScrollView style={styles.scrollContainer}>
                
                <TouchableOpacity 
                // key={index}
                style={styles.container}
                onPress={() => navigate('chatView')}
                >
                    <Message />
                </TouchableOpacity>
                

        </ScrollView>
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