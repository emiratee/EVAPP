import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Tab, TabView } from '@rneui/themed';
import { Text, View } from '../../components/Themed'
import React, { useState } from 'react'
import * as icons from '@expo/vector-icons';
import { TripCardItem } from '../../components/TripCard/TripCard'
import { getHistory, putApproveTrip } from '../../utils/apiService';
import { useAuth } from '../../utils/auth';
import { useFocusEffect, useNavigation } from 'expo-router';

type Props = {}

const history = (props: Props) => {
    const { token } = useAuth();
    const { navigate } = useNavigation();

    const [index, setIndex] = useState(0)
    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [previousTrips, setPreviousTrips] = useState([]);


    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                const history = await getHistory(token);

                const upcomingTrips = history.data.filter(trip => { return new Date(trip.trip.date) >= new Date() });
                const previousTrips = history.data.filter(trip => { return new Date(trip.trip.date) < new Date() });

                setUpcomingTrips(upcomingTrips);
                setPreviousTrips(previousTrips);

            })();
        }, [])
    );


    return (
        <>
            <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                indicatorStyle={{
                    backgroundColor: 'white',
                    height: 3,
                }}
                variant="primary"
            >
                <Tab.Item
                    title="Scheduled"
                    titleStyle={{ fontSize: 12 }}
                    icon={<icons.MaterialIcons name="schedule" size={24} color="white" />}
                />
                <Tab.Item
                    title="Previous"
                    titleStyle={{ fontSize: 12 }}
                    icon={<icons.MaterialIcons name="history" size={24} color="white" />}
                />
            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring" >
                <View style={previous.container}>
                    <FlatList
                        data={upcomingTrips}
                        renderItem={({ item }) => {
                            const requestAmount = item.trip.passengerIDs.length;

                            return (
                                <TouchableOpacity style={previous.card} onPress={() => {
                                    const passengers = item.trip.passengerIDs;
                                    requestAmount > 0 && navigate('BookRequest', { trip: item.trip, passengers });
                                }}>
                                    <TripCardItem trip={item.trip} driver={item.driver} />
                                    <View style={[previous.pendingContainer, { backgroundColor: requestAmount === 0 ? '#000' : '#5aa363' }]}>
                                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{`${item.trip.passengerIDs.filter(passenger => passenger.status === 'Pending').length} pending requests`}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </TabView>
        </>
    )
}

export default history

const previous = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2',
        position: 'relative',
        height: '100%',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    card: {
        minWidth: '95%',
        backgroundColor: '#f2f2f2',
    },
    pendingContainer: {
        position: 'absolute',
        top: 15,
        right: 100,
        flex: 1,
        backgroundColor: '#000',
        borderColor: 'transparent',
        borderWidth: 1,
        borderRadius: 12,
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
})