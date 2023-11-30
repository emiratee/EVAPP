import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { putApproveTrip, putRejectTrip } from '../utils/apiService';
import { useAuth } from '../utils/auth';

type Props = {
    trip: any,
    driver: any
}



const HistoryItem = (props: Props) => {
    const [passengers, setPassengers] = useState(props.trip)
    const { token } = useAuth();

    return (
        <View>
            {props.trip.passengerIDs.length ? <View style={{ margin: 10, gap: 10, }}>
                {
                    passengers.passengerIDs.map((el, index) => {
                        return <View key={index} style={[{ padding: 10, borderWidth: 1, backgroundColor: '#a8a8a8', borderRadius: 8 }, el.status === 'Approved' && { backgroundColor: 'green' }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={{ fontWeight: "bold" }}>{el.name}</Text>
                                    <Text>Seats: {el.seats}</Text>
                                </View>
                                <Text>Status: {el.status}</Text>
                            </View>
                            {/* check to === when done */}
                            {el.status === 'Pending' && <View style={styles.buttonsContainer}>
                                <TouchableOpacity style={styles.approveButton} onPress={
                                    () => {
                                        const formData = {
                                            tripId: props.trip._id,
                                            passengerId: el.userId,
                                            totalCredits: (el.seats * Number(props.trip.price)).toString()
                                        }
                                        putApproveTrip(formData, token)

                                        setPassengers((prev) => {
                                            return {
                                                ...prev,
                                                passengerIDs: prev.passengerIDs.map((passenger, i) => {
                                                    if (i === index) {
                                                        // Update the status for the specific passenger at the given index
                                                        return { ...passenger, status: 'Approved' };
                                                    }
                                                    return passenger; // For other passengers, return the original object
                                                }),
                                            };
                                        });

                                    }
                                }>
                                    <Text >Approve</Text>
                                </TouchableOpacity>


                                <TouchableOpacity style={styles.rejectButton} onPress={
                                    () => {
                                        const formData = {
                                            tripId: props.trip._id,
                                            passengerId: el.userId,
                                            totalCredits: (el.seats * Number(props.trip.price)).toString(),
                                            seats: el.seats
                                        }
                                        putRejectTrip(formData, token)
                                        setPassengers((prev) => {
                                            return {
                                                ...prev,
                                                passengerIDs: prev.passengerIDs.map((passenger, i) => {
                                                    if (i === index) {
                                                        // Update the status for the specific passenger at the given index
                                                        return { ...passenger, status: 'Rejected' };
                                                    }
                                                    return passenger; // For other passengers, return the original object
                                                }),
                                            };
                                        });
                                    }
                                }>
                                    <Text>Reject</Text>
                                </TouchableOpacity>
                            </View>}
                        </View>
                    })
                }


            </View> :

                <Text>No requests yet!</Text>

            }
        </View>
    )
}

export default HistoryItem

const styles = StyleSheet.create({

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10
    },
    approveButton: {
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 8,
        width: '50%',
        alignItems: 'center',
    },
    rejectButton: {
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 8,
        width: '50%',
        alignItems: 'center',
    },
})