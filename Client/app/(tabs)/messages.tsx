import React from 'react';
import TripCard from '../../components/TripCard/TripCard';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useAuth } from '../../utils/auth';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View } from 'react-native';

export default function messages() {
    const { isAuthenticated, user } = useAuth();
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            if (!isAuthenticated) {
                navigation.navigate('login');
            }
        }, [isAuthenticated])
    );
    return (
        <ScrollView style={styles.scrollContainer}>

            {/* TOP MESSAGE BUTTONS */}
            <View style={styles.topButtons}> 
                <TouchableOpacity style={[styles.inbox, {backgroundColor: '#000', borderBottomWidth: 4, borderBottomColor:'#9980f2'}]}>
                    <Text style={{color: '#fff'}}>Inbox Messages</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inbox}>
                    <Text>Sent Messages</Text>
                </TouchableOpacity>
            </View>

            {/* MESSAGES BODY w/ fake messages for now */}
            <View style={styles.container}>
                <View style={styles.message}>
                    {/* Here we will use the imageUrl of the driver or user -> {user.imageUrl} */}
                    <View style={styles.image}>
                        <Text style={{height: 20, width: 20, textAlign: 'center'}}>M</Text>
                    </View>
                    <View>
                        {/* Here we will use the name of the driver or user -> {user.name} */}
                        <Text>Manolo García</Text> 
                        <Text>Hey, I'm waiting for you in...</Text>
                    </View>
                </View>
            </View>

            <View style={styles.container}>
                <View style={styles.message}>
                    {/* Here we will use the imageUrl of the driver or user -> {user.imageUrl} */}
                    <View style={styles.image}>
                        <Text style={{height: 20, width: 20, textAlign: 'center'}}>B</Text>
                    </View>
                    <View>
                        {/* Here we will use the name of the driver or user -> {user.name} */}
                        <Text>Britney Spears</Text> 
                        <Text>It's Britney b*tch💕 </Text>
                    </View>
                </View>
            </View>

            <View style={styles.container}>
                <View style={styles.message}>
                    {/* Here we will use the imageUrl of the driver or user -> {user.imageUrl} */}
                    <View style={styles.image}>
                        <Text style={{height: 20, width: 20, textAlign: 'center'}}>C</Text>
                    </View>
                    <View>
                        {/* Here we will use the name of the driver or user -> {user.name} */}
                        <Text>Chuck Norris</Text> 
                        <Text>Hi Magdalena, do you need help with...</Text>
                    </View>
                </View>
            </View>

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
    topButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
    inbox: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        marginBottom: 20,
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
        marginBottom: 10,   
    },
    message: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 15,
    },
    image: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 20,
    }

});