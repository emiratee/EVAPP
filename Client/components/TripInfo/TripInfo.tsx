import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Request from './Request/Request';
import DriverInformation from './DriverInformation/DriverInformation';
import LocationInformation from './LocationInformation/LocatioInformation';
import Map from '../../app/(tabs)/map';
import { useAuth } from '../../utils/auth';

const TripInfoModalScreen = ({ trip, driver }) => {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <FlatList
                data={[trip]}
                renderItem={({ item }) => (
                    <>
                        <Map departure={item.departure.address} destination={item.destination.address}/>
                        <LocationInformation trip={item} />
                        <DriverInformation trip={item} driver={driver} />
                    </>
                )}
                keyExtractor={(item, index) => index.toString()}
                style={{ width: '100%', height: '100%' }}
            />
            {user && user.userId !== trip.driverID && <Request trip={trip} />}
        </View>
    );
}

export default TripInfoModalScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        width: '100%',
        height: '100%'
    }
});