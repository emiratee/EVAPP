import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Request from './Request/Request';
import DriverInformation from './DriverInformation/DriverInformation';
import LocationInformation from './LocationInformation/LocatioInformation';
import Map from '../Map';
import { useAuth } from '../../utils/auth';
import * as types from '../../types/types'
import COLORS from '../../COLORS';

type Props = {
    trip: types.TTrip,
    driver: types.TUser
}

const TripInfoModalScreen = ({ trip, driver }: Props) => {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <FlatList
                data={[trip]}
                renderItem={({ item }) => (
                    <>
                        {item.departure.address && item.destination.address && <Map departure={item.departure.address} destination={item.destination.address} />}
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
        backgroundColor: COLORS.backgroundColor,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        width: '100%',
        height: '100%'
    }
});