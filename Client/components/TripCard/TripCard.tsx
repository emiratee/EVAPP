import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import * as icons from '@expo/vector-icons';
import React from 'react';
import { useNavigation } from 'expo-router';

export const TripCardItem = ({ trip, driver }) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.locationContainer}>
                <View style={styles.dotContainer}>
                    <View style={styles.dot}>
                        <View style={styles.line}></View>
                    </View>
                    <View style={styles.dot}></View>
                </View>
                <View style={styles.addressContainer}>
                    <View style={styles.mainContainer}>
                        <Text style={styles.city}>{trip.departure.city}</Text>
                        <Text style={styles.time}>{trip.departure.time}</Text>
                    </View>
                    <View style={styles.mainContainer}>
                        <Text style={styles.totalTime}>{trip.totalTime}</Text>
                    </View>
                    <View style={styles.mainContainer}>
                        <Text style={styles.city}>{trip.destination.city}</Text>
                        <Text style={styles.time}>{trip.destination.time}</Text>
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
                    <Image
                        source={require('../../assets/images/driver.png')}
                        style={{ height: 50, width: 50, borderRadius: 50 }}
                    />
                </View>
            </View>
        </View>
    );
};

const TripCard = ({ response }) => {
    const navigate = useNavigation();
    return (
        <View style={styles.list}>
            <FlatList
                data={response.trips}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.cardButton} onPress={() => {
                        navigate.navigate('TripInfo', { trip: item.trip, driver: item.driver })
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