import { FlatList, StyleSheet } from 'react-native'
import { Tab, TabView } from '@rneui/themed';
import { Text, View } from '../../components/Themed'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native';
import * as icons from '@expo/vector-icons';
import { TripCardItem } from '../../components/TripCard/TripCard'
import { useMockData } from '../../utils/mockData';

type Props = {}

const history = (props: Props) => {

    const [index, setIndex] = useState(0)
    const { trips, mockUsers } = useMockData();

    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [previousTrips, setPreviousTrips] = useState([]);

    const tripsToEvaluate = [...mockUsers[0].tripsAsDriverIDs, ...mockUsers[0].tripsAsPasangerIDs]
    const date = Date.now();

    useEffect(() => {

        console.log(tripsToEvaluate);
        //find trip info
        let findTrips = tripsToEvaluate.map(trip => {
            return trips.find(el => el.id === trip)
        });
        console.log('find trips', findTrips)

        let upTrips = findTrips.filter(trip => {
            return new Date(trip.date) >= new Date("2023-11-20T00:00:00.000Z")
        });


        let prevTrips = findTrips.filter(trip => {
            console.log('prev-date', new Date(trip.date))
            return new Date(trip.date) < new Date("2023-11-20T00:00:00.000Z")
        });

        console.log('uptrips', upTrips);
        console.log(new Date("2023-11-20T00:00:00.000Z"))
        console.log('prevTrips', prevTrips);

        setUpcomingTrips(upTrips);
        setPreviousTrips(prevTrips);
    }, [trips]);

    // console.log(upcomingTrips, previousTrips)

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
                            <TripCardItem trip={item} />
                        </View>
                    )}
                />

                <FlatList
                    data={previousTrips}
                    renderItem={({ item }) => (
                        <View style={styles.cardButton} >
                            <TripCardItem trip={item} />
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
        height: 175
    },
})