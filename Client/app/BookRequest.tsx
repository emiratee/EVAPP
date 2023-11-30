import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { View } from "../components/Themed";
import * as icons from '@expo/vector-icons';


const BookingCard = ({ passenger }) => {
    const [status, setStatus] = useState<any>();
    const [statusColor, setStatusColor] = useState('#5aa363')

    useEffect(() => {
        switch (passenger.status) {
            case 'Pending':
                setStatus(<icons.MaterialIcons name="hourglass-top" size={20} color="black" style={{ transform: 'rotate(180deg)' }} />);
                setStatusColor('#e29257')
                break;
            case 'Approved':
                setStatus(<icons.Ionicons name="ios-checkmark-circle" size={20} color="black" />);
                setStatusColor('#5aa363')
                break;
            case 'Rejected':
                setStatus(<icons.FontAwesome5 name="exclamation-circle" size={20} color="black" />)
                setStatusColor('red')
                break;
            default:
                setStatus(<icons.MaterialIcons name="hourglass-top" size={20} color="black" style={{ transform: 'rotate(180deg)' }} />);
                setStatusColor('#5aa363')
        }
    }, []);

    return (
        <View style={request.card}>
            <View style={request.header}>
                <View style={request.information}>
                    <Text style={request.name}>{passenger.name}</Text>
                    <View style={request.seats}>
                        <icons.MaterialCommunityIcons name="seat-passenger" size={18} color="black" />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{passenger.seats}</Text>
                    </View>
                </View>
                <View style={request.status}>
                    <Text style={request.statusText}>Status:</Text>
                    <Text style={[request.passengerStatus, { color: statusColor }]}>{passenger.status}</Text>
                    {status}
                </View>
            </View>
            {passenger.status === 'Pending' ? (
                <View style={request.footerContainer}>
                    <TouchableOpacity style={[request.button, { backgroundColor: '#5aa363' }]}>
                        <Text style={request.buttonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[request.button, { backgroundColor: 'red' }]}>
                        <Text style={request.buttonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            ): (
                <View style={request.footerContainer}>
                    <Text style={request.footerText}>
                        {passenger.status === 'Approved' ? 'You accepted this booking offer' : "You rejected this booking offer" }
                    </Text>
                </View>
            )}
        </View>
    )
}

export default function ModalScreen() {
    const { passengers } = useRoute().params;
    console.log(passengers);

    return (
        <View style={request.container}>
            <Text style={request.title}>{`You have ${passengers.length} booking requests`}</Text>
            <FlatList
                data={passengers}
                renderItem={({ item }) => (
                    <BookingCard passenger={item} />
                )}
            />
        </View>
    );
}

const request = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#f2f2f2',
        position: 'relative',
        width: '100%',
        padding: 5,
        gap: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    card: {
        flex: 1,
        alignItems: 'flex-start',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderColor: '#a8a8a8',
        borderRadius: 15,
        minWidth: '95%',
        maxWidth: '95%',
        minHeight: 100,
        marginLeft: '2.5%',
        padding: 10,
        marginBottom: 10
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    information: {
        flexDirection: 'column',
        gap: 5
    },
    seats: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 23 //icon size from seats + gap
    },
    statusText: {
        fontSize: 16,
        fontWeight: '500',
        paddingRight: 5
    },
    passengerStatus: {
        fontSize: 18,
        fontWeight: '600',
    },
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        borderRadius: 10,
        borderColor: 'transparent'
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff'
    },
    footerText: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
