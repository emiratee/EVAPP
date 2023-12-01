import { StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import { useNavigation } from 'expo-router';
import TripCardItem from './TripCardItem/TripCardItem';


const TripCard = ({ response }) => {
    const { navigate } = useNavigation();
    return (
        <View style={styles.list}>
            <FlatList
                data={response.trips}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.cardButton} onPress={() => {
                        navigate('TripInfo', { trip: item.trip, driver: item.driver })
                    }} >
                        <TripCardItem trip={item.trip} driver={item.driver} />
                    </TouchableOpacity >
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                style={{ width: '100%' }}
            />
        </View >
    );
};

export default TripCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        width: '100%',
        height: '100%'
    },
    cardButton: {
        width: '100%',
        height: 175,
        overflow: 'hidden'
    },
    list: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        width: '100%',
        padding: 5,
    }
});