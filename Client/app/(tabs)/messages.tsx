import React from 'react';
import { Text } from '../../components/Themed';
import TripCard from '../../components/TripCard/TripCard';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useAuth } from '../../utils/auth';

export default function messages() {

    const { isAuthenticated } = useAuth();
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            if (!isAuthenticated) {
                navigation.navigate('login');
            }
        }, [isAuthenticated])
    );
    return (
        <Text>Messages</Text>
    );
}