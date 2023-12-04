import { StyleSheet, Text, View, Image, Animated, Easing } from 'react-native';
import * as icons from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import * as types from '../../../types/types'

type Props = {
    trip: types.TTrip,
    driver: types.TUser
}

const TripCardItem = ({ trip, driver }: Props) => {
    const [lineAnimation, setLineAnimation] = useState<Animated.Value>(new Animated.Value(0));

    useEffect(() => {
        animateLine();
        setTimeout(() => {
            setLineAnimation(new Animated.Value(0));
        }, 250)
    }, []);


    const animateLine = () => {
        Animated.timing(lineAnimation, {
            toValue: 1,
            duration: 250,
            easing: Easing.linear,
            useNativeDriver: false
        }).start();
    }

    const lineHeight = lineAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 120],
    });

    // console.log("trip:" , trip)

    return (
        <Animated.View style={styles.cardContainer}>
            <View style={styles.locationContainer}>
                <View style={styles.dotContainer}>
                    <View style={styles.dot}>
                        <Animated.View style={[styles.line, { height: lineHeight }]}></Animated.View>
                    </View>
                    <View style={styles.dot}></View>
                </View>
                <View style={styles.addressContainer}>
                    <View style={styles.mainContainer}>
                        <Text style={styles.city}>{trip.departure.city}</Text>
                        <Text style={styles.time}>{moment(trip.date).format('DD MMM')} {trip.departure.time}</Text>
                    </View>
                    <View style={styles.mainContainer}>
                        <Text style={styles.totalTime}>{trip.totalTime}</Text>
                    </View>
                    <View style={styles.mainContainer}>
                        <Text style={styles.city}>{trip.destination.city}</Text>
                        <Text style={styles.time}>{moment(trip.destination.date).format('DD MMM')} {trip.destination.time}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.information}>
                <View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{`${parseFloat(trip.price).toFixed(2)}€`}</Text>
                    </View>
                    <View style={styles.seatContainer}>
                        <icons.MaterialCommunityIcons name="seat-passenger" size={18} color="black" />
                        <Text style={styles.seats}>{`${trip.seats.available}/${trip.seats.total}`}</Text>
                    </View>
                </View>
                <View style={styles.informationItem}>
                    <View>
                        <Text style={styles.name}>{driver.name}</Text>
                        <View style={styles.ratingContainer}>
                            <icons.AntDesign name='star' size={12} />
                            <Text style={styles.rating}>{driver.driverRating.averageRating}</Text>
                        </View>
                    </View>
                    {driver.imageUrl ?
                        <Image
                            source={{ uri: driver.imageUrl }}
                            style={{ height: 50, width: 50, borderRadius: 50 }}
                        />
                        :
                        <icons.AntDesign name="user" size={30} color="black" style={{ alignSelf: 'center', height: 50, width: 50, borderRadius: 50, padding: 10 }} />
                    }
                </View>
            </View>
        </Animated.View>
    );
};

export default TripCardItem;

const styles = StyleSheet.create({
    horizontalLine: {
        backgroundColor: '#000',
        width: '99%',
        alignSelf: 'center',
        height: 1,
    },
    locationContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '95%',
        height: 150,
        position: 'relative',
        borderColor: '#a8a8a8',
        borderRadius: 15,
    },
    timeContainer: {
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: 2.5
    },
    dotContainer: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        height: '95%',
        paddingTop: 10,
        paddingHorizontal: 15
    },
    addressContainer: {
        flex: 1,
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    mainContainer: {
        flexDirection: 'column',
    },
    address: {
        fontSize: 18,
        fontWeight: '600'
    },
    totalTime: {
        fontSize: 15,
        fontWeight: '300',
    },
    dot: {
        backgroundColor: '#000',
        width: 12,
        height: 12,
        borderRadius: 50,
    },
    line: {
        position: 'absolute',
        backgroundColor: '#000',
        width: 6,
        height: 120,
        top: 10,
        bottom: 0,
        left: 3,
        zIndex: 999
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