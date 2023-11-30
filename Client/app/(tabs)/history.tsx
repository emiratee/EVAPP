import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Tab, TabView } from '@rneui/themed';
import { Text, View } from '../../components/Themed'
import React, { useEffect, useState } from 'react'
import * as icons from '@expo/vector-icons';
import { TripCardItem } from '../../components/TripCard/TripCard'
import { useMockData } from '../../utils/mockData';
import { getHistory, putApproveTrip } from '../../utils/apiService';
import { useAuth } from '../../utils/auth';
import { useFocusEffect } from 'expo-router';
import HistoryItem from '../../components/HistoryItem';

type Props = {}

const history = (props: Props) => {

    const { token } = useAuth();

    const [index, setIndex] = useState(0)

    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [previousTrips, setPreviousTrips] = useState([]);

    const date = Date.now();
    useFocusEffect(
        React.useCallback(() => {
            getHistory(token).then(data => {

                console.log('data:', data.data);

                let upTrips = data.data.filter(trip => {
                    return new Date(trip.trip.date) >= new Date()
                });


                let prevTrips = data.data.filter(trip => {
                    // console.log('prev-date', new Date(trip.trip.date))
                    return new Date(trip.trip.date) < new Date()
                });

                setUpcomingTrips(upTrips);
                setPreviousTrips(prevTrips);
            }
            )
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

            <TabView value={index} onChange={setIndex} animationType="spring">

                <FlatList
                    data={upcomingTrips}
                    renderItem={({ item }) => (
                        <View style={styles.cardButton} >
                            <TripCardItem trip={item.trip} driver={item.driver} />
                            <HistoryItem trip={item.trip} driver={item.driver}/>
                        </View>
                    )}
                />

                <FlatList
                    data={previousTrips}
                    renderItem={({ item }) => (
                        <View style={[!item.succesful ? styles.disablecardButton : styles.cardButton]} >
                            <TripCardItem trip={item.trip} driver={item.driver} />
                        </View>
                    )}
                />
            </TabView>
        </>
    )
}

export default history

const styles = StyleSheet.create({
    cardButton: {
        width: '100%',
    },
    disablecardButton: {
        opacity: 0.5,
        width: '100%',
        height: 175
    },
    buttonsContainer: {
        flexDirection: 'row',
    }
})