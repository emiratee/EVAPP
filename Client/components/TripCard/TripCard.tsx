import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

const trips = [
    {
        departure_city: 'Berlin',
        destination_city: 'Hamburg',
        departure_time: '12:15',
        destination_time: '15:30',
        stops: [
            {
                city: 'Lüneburg',
                arrival_time: '14:45'
            }
        ],
        driver: {
            name: 'Vladislav',
            rating: '4,7'
        },
        price: '18.00',
        seats: {
            available: 2,
            total: 3
        }
    },
    {
        departure_city: 'Berlin',
        destination_city: 'Recklinghausen',
        departure_time: '12:15',
        destination_time: '16:35',
        driver: {
            name: 'Vladislav',
            rating: '4,7'
        },
        price: '18.00',
        seats: {
            available: 2,
            total: 3
        }
    },
    {
        departure_city: 'Berlin',
        destination_city: 'Hamburg',
        departure_time: '12:15',
        destination_time: '15:30',
        driver: {
            name: 'Vladislav',
            rating: '4,7'
        },
        price: '18.00',
        seats: {
            available: 2,
            total: 3
        }
    }
];

const TripCardItem = ({ trip }) => {
    return (
        <TouchableOpacity style={styles.cardButton}>
            <View style={styles.cardContainer}>
                <View style={styles.route}>
                    {/* Departure Information */}
                    <View style={styles.routeItem}>
                        <View style={styles.dot}>

                            <View style={styles.line}></View>
                        </View>
                        <View>
                            <Text style={styles.city}>{trip.departure_city}</Text>
                            <Text style={styles.time}>{trip.departure_time}</Text>
                        </View>
                    </View>
                    {/* Destination Information */}
                    <View style={styles.routeItem}>
                        <View style={styles.dot}></View>
                        <View>
                            <Text style={styles.city}>{trip.destination_city}</Text>
                            <Text style={styles.time}>{trip.destination_time}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.information}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{`${trip.price}€`}</Text>
                    </View>
                    <View style={styles.informationItem}>
                        <View>
                            <Text style={styles.name}>{trip.driver.name}</Text>
                            <View style={styles.ratingContainer}>
                                <MaterialCommunityIcons name='star' size={15} />
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
        </TouchableOpacity>
    );
};

const TripCard = () => {
    return (
        <View style={styles.list}>
            <FlatList
                data={trips}
                renderItem={({ item }) => (
                    <TripCardItem trip={item} />
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
        borderColor: '#000',
        borderWidth: 1,
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
        gap: 3
    },
    rating: {
        fontSize: 12
    }
});