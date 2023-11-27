import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import * as icons from '@expo/vector-icons';
import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { useMockData } from '../../mockData';


export const TripCardItem = ({ trip }) => {

    return (
        <View style={styles.cardContainer}>
            <View style={styles.route}>
                {/* Departure Information */}
                <View style={styles.routeItem}>
                    <View style={styles.dot}>

                        <View style={styles.line}></View>
                    </View>
                    <View>
                        <Text style={styles.city}>{trip.departure.city}</Text>
                        <Text style={styles.time}>{trip.departure.time}</Text>
                    </View>
                </View>
                {/* Destination Information */}
                <View style={styles.routeItem}>
                    <View style={styles.dot}></View>
                    <View>
                        <Text style={styles.city}>{trip.destination.city}</Text>
                        <Text style={styles.time}>{trip.destination.time}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.information}>
                <View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{`${trip.price}€`}</Text>
                    </View>
                    <View style={styles.seatContainer}>
                        <icons.MaterialCommunityIcons name="seat-passenger" size={18} color="black" />
                        <Text style={styles.seats}>{`${trip.seats.available}/${trip.seats.total}`}</Text>
                    </View>
                </View>
                <View style={styles.informationItem}>
                    <View>
                        <Text style={styles.name}>{trip.driver.name}</Text>
                        <View style={styles.ratingContainer}>
                            <icons.AntDesign name='star' size={12} />
                            <Text style={styles.rating}>{trip.driver.rating}</Text>
                        </View>
                    </View>
                    <Image
                        source={require('../../assets/images/driver.png')}
                        style={{ height: 50, width: 50, borderRadius: 50 }}
                    />
                </View>
            </View>
        </View>
    );
};

const TripCard = () => {

    const navigate = useNavigation();
    const { trips, setTrips } = useMockData()


    return (
        <View style={styles.list}>
            <FlatList
                data={trips}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.cardButton} onPress={() =>{
                        console.log('we here', item)
                    navigate.navigate('TripInfo', { trip:  item })}} >
                <TripCardItem trip={item} />
            </TouchableOpacity>
                )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            style={{ width: '100%' }} // Ensuring FlatList takes full width

            />
        </View>
    );
};

export default TripCard

const styles = StyleSheet.create({
    list: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        width: '100%',
        padding: 5,
    },
    cardButton: {
        width: '100%',
        height: 175
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 5,
        backgroundColor: '#fff',
        borderColor: '#a8a8a8',
        borderRadius: 15,
        padding: 10,
    },
    city: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    time: {
        fontSize: 13,
        fontWeight: '200'
    },
    route: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
    },
    routeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
    },
    dot: {
        backgroundColor: '#000',
        width: 12,
        height: 12,
        borderRadius: 50,
        marginRight: 10,
    },
    line: {
        position: 'absolute',
        backgroundColor: '#000',
        width: 6,
        height: 100,
        top: 10,
        bottom: 0,
        left: 3,
    },
    priceContainer: {
        flex: 1,
        backgroundColor: '#000',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 12,
        maxHeight: 40,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    price: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    seatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        padding: 5
    },
    seats: {
        fontSize: 12,
        fontWeight: '600'
    },
    information: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 10,
    },
    informationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        gap: 3
    },
    rating: {
        fontSize: 12
    }
});