import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';

const trips = [
    {
        departure_city: 'Berlin',
        destination_city: 'Hamburg',
        departure_time: '12:15',
        destination_time: '15:30',
        driver: {
            name: 'Manfred',
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
            name: 'Manfred',
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
            name: 'Manfred',
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
                        <View style={styles.textInfo}>
                            <Text style={styles.city}>{trip.departure_city}</Text>
                            <Text style={styles.time}>{trip.departure_time}</Text>
                        </View>
                    </View>
                    {/* Destination Information */}
                    <View style={styles.routeItem}>
                        <View style={styles.dot}></View>
                        <View style={styles.textInfo}>
                            <Text style={styles.city}>{trip.destination_city}</Text>
                            <Text style={styles.time}>{trip.destination_time}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    {/* Other Details */}
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
        marginVertical: 5,
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
    },
    city: {
        fontSize: 18
    },
    time: {
        fontSize: 13
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
        top: 10, // Adjust this value according to your layout
        bottom: 0, // Adjust this value according to your layout
        left: 3, // Adjust this value according to your layout
    },
    textInfo: {
        flex: 1,
    },
});