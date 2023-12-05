import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import * as icons from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TripCardItem from '../../components/TripCard/TripCardItem/TripCardItem';
import StarRating from 'react-native-star-rating-widget';
import * as types from '../../types/types';
import {
  getHistory,
  putEarningsToAvailable,
  putMarkTripSuccessful,
  putAddReview,
} from '../../utils/apiService';
import { useAuth } from '../../utils/auth';
import { useFocusEffect, useNavigation } from 'expo-router';
import { ButtonGroup } from 'react-native-elements';

const History2 = () => {
  const { token, user, isAuthenticated } = useAuth();
  const { navigate } = useNavigation();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [upcomingTrips, setUpcomingTrips] = useState<{ trip: types.TTrip; driver: types.TUser }[]>([]);
  const [previousTrips, setPreviousTrips] = useState<{ trip: types.TTrip; driver: types.TUser }[]>([]);
  const [currentTrips, setCurrentTrips] = useState<{ trip: types.TTrip; driver: types.TUser }[]>([]);
  const [rating, setRating] = useState<number>(0);
  let reviewed = false;

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        if (!isAuthenticated) return navigation.navigate('login');
        // if (!isAuthenticated) return router.push('./login')

        const history = token && await getHistory(token);

        const upcomingTrips = history.data.filter((trip: { trip: types.TTrip, driver: types.TUser }) => { return new Date(trip.trip.date + 'T' + trip.trip.departure.time + ':00') >= new Date() });
        const previousTrips = history.data.filter((trip: { trip: types.TTrip, driver: types.TUser }) => {
          return (
            (new Date(trip.trip.date + 'T' + trip.trip.departure.time + ':00') < new Date() &&
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
    const formData = {
      tripId: trip._id,
      successful: true,
    };

    const price = trip.price;

    const totalSeats = trip.passengerIDs.reduce((accumulator, passenger) => {
      return accumulator + passenger.seats;
    }, 0);

    const totalCredits = (totalSeats * Number(price)).toString();

    putMarkTripSuccessful(formData, token);
    putEarningsToAvailable({ totalCredits }, token);
  };

  const buttons = ['Upcoming', 'Previous', 'Ongoing'];

  const renderUpcomingTrips = () => {
    return (

      upcomingTrips.length > 0 ? (
        <FlatList
          data={upcomingTrips}
          renderItem={({ item }: { item: { trip: types.TTrip; driver: types.TUser } }) => {
            const passengers = item.trip.passengerIDs;
            const requestAmount = passengers.filter(passenger => passenger.userId !== user.userId && passenger.status === 'Pending').length;

            return (
              <TouchableOpacity style={styles.card} onPress={() => {
                user.userId === item.trip.driverID && navigate('BookRequest', { trip: item.trip, passengers: item.trip.passengerIDs });
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
      )

    );
  };

  const renderPreviousTrips = () => {
    return (
      previousTrips.length > 0 ? (<FlatList
        data={previousTrips}
        renderItem={({ item }: { item: { trip: types.TTrip; driver: types.TUser } }) => {
          {
            reviewed = item.trip.passengerIDs.some(
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
        }}
      />) : (
        <Text>No previous Trips</Text>
      )
    );
  };

  const renderCurrentTrips = () => {
    return (
      currentTrips.length > 0 ? (<FlatList
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
      )


    );
  };

  return (
    <View style={styles.container}>
      <ButtonGroup
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={styles.buttonContainer}
        selectedButtonStyle={styles.selectedButton}
        onPress={(selectedIdx) => setSelectedIndex(selectedIdx)}
      />

      {selectedIndex === 0 && renderUpcomingTrips()}
      {selectedIndex === 1 && renderPreviousTrips()}
      {selectedIndex === 2 && renderCurrentTrips()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  buttonContainer: {
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  selectedButton: {
    backgroundColor: '#000',
  },
  card: {
    minWidth: '95%',
    backgroundColor: '#f2f2f2',
    marginVertical: 10,
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
    paddingHorizontal: 10,
  },
});

export default History2;