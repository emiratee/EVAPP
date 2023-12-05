import { FlatList, StyleSheet, TouchableOpacity, Text, View, SafeAreaView } from 'react-native'
import { Tab, TabView } from '@rneui/themed';
import React, { useState } from 'react'
import * as icons from '@expo/vector-icons';
import { getHistory, putEarningsToAvailable, putMarkTripSuccessful, putAddReview } from '../../utils/apiService';
import { useAuth } from '../../utils/auth';
import { useFocusEffect, useNavigation, router } from 'expo-router';
import TripCardItem from '../../components/TripCard/TripCardItem/TripCardItem';
import * as types from '../../types/types'
import StarRating from 'react-native-star-rating-widget';

const history = () => {
    const { token, user, isAuthenticated } = useAuth();
    const { navigate } = useNavigation();

    const [index, setIndex] = useState<number>(0)
    const [upcomingTrips, setUpcomingTrips] = useState<{ trip: types.TTrip, driver: types.TUser }[]>([]);
    const [previousTrips, setPreviousTrips] = useState<{ trip: types.TTrip, driver: types.TUser }[]>([]);
    const [currentTrips, setCurrentTrips] = useState<{ trip: types.TTrip, driver: types.TUser }[]>([]);
    let reviewed = false;
    const [rating, setRating] = useState<number>(0);

    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                if (!isAuthenticated) return navigation.navigate('login');
                // if (!isAuthenticated) return router.push('./login')

                const history = token && await getHistory(token);

                const upcomingTrips = history.data.filter((trip: { trip: types.TTrip, driver: types.TUser }) => { return new Date(trip.trip.date  + 'T' + trip.trip.departure.time + ':00') >= new Date() });
                const previousTrips = history.data.filter((trip: { trip: types.TTrip, driver: types.TUser }) => {
                    return (
                        (new Date(trip.trip.date  + 'T' + trip.trip.departure.time + ':00') < new Date() &&
                            !trip.trip.successful && !trip.trip.passengerIDs.length) ||
                        (new Date(trip.trip.date + 'T' + trip.trip.departure.time + ':00') < new Date() &&
                            trip.trip.successful && trip.trip.passengerIDs.length)
                    )
                });
                const currentTripsArr = history.data.filter((trip: { trip: types.TTrip, driver: types.TUser }) => {
                    return (
                        (new Date(trip.trip.date + 'T' + trip.trip.departure.time + ':00') <= new Date() &&
                            !trip.trip.successful && trip.trip.passengerIDs.length))
                });

                setUpcomingTrips(upcomingTrips);
                setPreviousTrips(previousTrips);
                setCurrentTrips(currentTripsArr);
            })();
        }, [isAuthenticated])
    );

    const handleRating = (tripId, driverId, ratedValue) => {
        setRating(ratedValue);

        putAddReview({ tripId, driverId, rating: ratedValue }, token);
    };


    const handleComplete = (trip) => {
        //mark trip as success
        const formData = {
            tripId: trip._id,
            successful: true
        }

        const price = trip.price;

        const totalSeats = trip.passengerIDs.reduce((accumulator, passenger) => {
            return accumulator + passenger.seats;
        }, 0);

        const totalCredits = (totalSeats * Number(price)).toString();

        putMarkTripSuccessful(formData, token);
        putEarningsToAvailable({ totalCredits }, token)
    }

    console.log('reviewed: ', reviewed)
    
    return (
        user && <>
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
                    title="Upcoming"
                    titleStyle={{ fontSize: 12 }}
                    icon={<icons.MaterialIcons name="schedule" size={24} color="white" />}
                />
                <Tab.Item
                    title="Previous"
                    titleStyle={{ fontSize: 12 }}
                    icon={<icons.MaterialIcons name="history" size={24} color="white" />}
                />
                <Tab.Item
                    title="On going"
                    titleStyle={{ fontSize: 12 }}
                    icon={<icons.FontAwesome5 name="car-side" size={24} color="white" />}
                />
            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring" >
                <SafeAreaView style={styles.container}>
                    {upcomingTrips.length > 0 ? (
                        <FlatList
                            data={upcomingTrips}
                            renderItem={({ item }: { item: { trip: types.TTrip, driver: types.TUser } }) => {
                                const passengers = item.trip.passengerIDs;
                                const requestAmount = passengers.filter(passenger => passenger.userId !== user.userId && passenger.status === 'Pending').length;

                                return (
                                    <TouchableOpacity style={styles.card} onPress={() => {
                                        user.userId === item.trip.driverID && navigate('BookRequest', { trip: item.trip, passengers });
                                    }}>
                                        <TripCardItem trip={item.trip} driver={item.driver} />
                                        {user.userId === item.trip.driverID ? (
                                            <View style={[styles.pendingContainer, { backgroundColor: requestAmount === 0 ? '#000' : '#5aa363' }]}>
                                                <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{`${requestAmount} pending requests`}</Text>
                                            </View>
                                        ) : (
                                            <>
                                                {passengers.map(passenger => (
                                                    passenger.userId === user.userId && (
                                                        <View key={passenger.userId} style={[styles.pendingContainer, {
                                                            backgroundColor: passenger.status === 'Approved' ? '#5aa363' :
                                                                passenger.status === 'Pending' ? '#e29257' : '#ff0000'
                                                        }]}>
                                                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{passenger.status}</Text>
                                                        </View>
                                                    )
                                                ))}
                                            </>
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    ) : (
                        <Text>No upcoming Trips</Text>
                    )}
                </SafeAreaView>
                {/* show review button to passengers to review drivers */}

                <SafeAreaView style={styles.container}>
                    {previousTrips.length > 0 ? (<FlatList
                        data={previousTrips}
                        renderItem={({ item }: { item: { trip: types.TTrip, driver: types.TUser } }) => {

                                {reviewed = item.trip.passengerIDs.some(
                                        passenger => user && passenger.userId === user.userId && passenger.reviewed
                                    )
                                }
                            return <View style={[styles.card, { opacity: 0.5 }]}>
                                <TripCardItem trip={item.trip} driver={item.driver} />


                                {user.userId !== item.trip.driverID && !reviewed && <StarRating
                                        maxStars={5}
                                        rating={rating}
                                        onChange={(newRating) => { handleRating(item.trip._id, item.driver.userId, newRating) }}
                                        starSize={30} // Customize the size of the stars
                                        inactiveColor="#CCCCCC" // Customize the inactive star color
                                        activeColor="#FFD700" // Customize the active star color
                                    />

                                }
                            </View>
                        }
                        }
                    />) : (
                        <Text>No previous Trips</Text>
                    )}
                </SafeAreaView>

                {/* //ongoing trips - trips that are not marked as finished (aka sussessfull) and has passenger ID (DONE)
                // only for trip driver (driverID) -  A button to mark them as successful - only after the destination time has passed (DONE)
                   -> update backend for the trip - mark as successful (DONE)
                // trigger notification for review
                //
                    // */}
                <SafeAreaView style={styles.container}>
                    {currentTrips.length > 0 ? (<FlatList
                        data={currentTrips}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <TripCardItem trip={item.trip} driver={item.driver} />
                                {user.userId === item.trip.driverID &&
                                    (new Date(item.trip.date + 'T' + item.trip.departure.time + ':00') < new Date()) &&
                                    (new Date(item.trip.destination.date + 'T' + item.trip.destination.time + ':00') < new Date()) &&
                                    <TouchableOpacity onPress={() => { handleComplete(item.trip) }}>
                                        <Text>Mark as complete</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        )
                        }
                    />) : (
                        <Text>No on-going trips</Text>
                    )}
                </SafeAreaView>
            </TabView>
        </>
    )
}

export default history

const styles = StyleSheet.create({
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
        left: 140,
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