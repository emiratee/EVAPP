import { FlatList, StyleSheet } from 'react-native'
import { Tab, TabView } from '@rneui/themed';
import { Text, View } from '../../components/Themed'
import React, { useState } from 'react'
import { ScrollView } from 'react-native';
import * as icons from '@expo/vector-icons';
import { TripCardItem } from '../../components/TripCard/TripCard'
import { useMockData } from '../utils/mockData';

type Props = {}

const history = (props: Props) => {

    const [index, setIndex] = useState(0)
    const { trips, setTrips } = useMockData();

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
                    data={trips}
                    renderItem={({ item }) => (
                        <View style={styles.cardButton} >
                            <TripCardItem trip={item} />
                        </View>
                    )}
                />



                <ScrollView>
                    <Text>Favorittere</Text>
                </ScrollView>
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