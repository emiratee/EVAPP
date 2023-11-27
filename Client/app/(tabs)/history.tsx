import { FlatList, StyleSheet } from 'react-native'
import { Tab, TabView } from '@rneui/themed';
import { Text, View } from '../../components/Themed'
import React, { useState } from 'react'
import { ScrollView } from 'react-native';
import * as icons from '@expo/vector-icons';
import TripCardItem from '../../components/TripCard/TripCard'

type Props = {}

const history = (props: Props) => {

    const [index, setIndex] = useState(0)

    const dummyData = [
        {
            departure: {
                city: 'Berlin',
                address: 'Stresemannstraße 123c',
                time: '12:15'
            },
            destination: {
                city: 'Hamburg',
                address: 'Bornheide 9',
                time: '15:45'
            },
            trip: {
                total_time: '3:30',
                stops: [
                    {
                        city: 'Lüneburg',
                        arrival_time: '14:45'
                    }
                ],
            },
            driver: {
                name: 'Vladislav',
                rating: '2,3'
            },
            price: '18',
            seats: {
                available: 3,
                total: 5
            }
        },
        {
            departure: {
                city: 'Berlin',
                address: 'Stresemannstraße 123c',
                time: '12:15'
            },
            destination: {
                city: 'Hamburg',
                address: 'Bornheide 9',
                time: '15:45'
            },
            trip: {
                total_time: '3:30'
            },
            driver: {
                name: 'Erik',
                rating: '4,9'
            },
            price: '14.30',
            seats: {
                available: 1,
                total: 3
            }
        },
        {
            departure: {
                city: 'Berlin',
                address: 'Stresemannstraße 123c',
                time: '12:15'
            },
            destination: {
                city: 'Hamburg',
                address: 'Bornheide 9',
                time: '15:45'
            },
            trip: {
                total_time: '3:30'
            },
            driver: {
                name: 'Oguz',
                rating: '4,1'
            },
            price: '23',
            seats: {
                available: 1,
                total: 5
            }
        }
    ]


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
                {/* <ScrollView>
                    */}
                    <Text>Receterxnt</Text> 
                    <FlatList
                    data={dummyData}
                    renderItem={({ item }) => (
                        <TripCardItem trip={item} />
                    )}
                    />

                {/* </ScrollView> */}
                <ScrollView>
                    <Text>Favorittere</Text>
                </ScrollView>
            </TabView>
        </>
    )
}

export default history

const styles = StyleSheet.create({})