import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as icons from '@expo/vector-icons';
import { useAuth } from "../utils/auth";
import { postChat, putApproveTrip, putRejectTrip } from "../utils/apiService";
import * as types from '../types/types'
import COLORS from "../COLORS";
import { useChat } from "../utils/chat";
import { useNavigation } from "expo-router";

type Props = {
    trip: types.TTrip,
    passenger: types.TPassengerIDs,
    bookingId: string,
    setRequests: React.Dispatch<React.SetStateAction<number>>
}

const BookingCard = ({ trip, passenger, bookingId, setRequests }: Props) => {
    
    const { token, user } = useAuth();
    const { setName, setImageUrl } = useChat();
    const { navigate } = useNavigation();

    const [icon, setIcon] = useState<React.JSX.Element | undefined>(undefined);
    const [statusColor, setStatusColor] = useState<string>('#5aa363');
    const [status, setStatus] = useState<string>(passenger.status);

    useEffect(() => {
        switch (status) {
            case 'Pending':
                setIcon(<icons.MaterialIcons name="hourglass-top" size={20} color={COLORS.iconColor} style={[{ transform: [{ rotate: '180deg' }] }]} />);
                setStatusColor(COLORS.iconColor)
                break;
            case 'Approved':
                setIcon(<icons.Ionicons name="ios-checkmark-circle" size={20} color={COLORS.backgroundColor} />);
                setStatusColor(COLORS.textColour)
                break;
            case 'Rejected':
                setIcon(<icons.FontAwesome5 name="exclamation-circle" size={20} color="black" />)
                setStatusColor('black')
                break;
            default:
                setIcon(<icons.MaterialIcons name="hourglass-top" size={20} color={COLORS.backgroundColor} style={[{ transform: [{ rotate: '180deg' }] }]} />);
                setStatusColor('#e29257')
        }
    }, [status]);

    const createConversation = async () => {
        const { chat } = await postChat(user.userId, passenger.userId, token);        
        navigate('chatView', { chat });
        setName(chat.driver.name);
        setImageUrl(chat.driver.imageUrl);
    }

    const handleSubmit = (type: string): any => {
        let confirmationMessage = type === 'Approved'
            ? 'Are you sure you want to accept this offer?'
            : 'Are you sure you want to reject this offer?';

        Alert.alert(
            'Confirm',
            confirmationMessage,
            [
                {
                    text: 'Confirm',
                    onPress: async () => {
                        setStatus(type);
                        setRequests((prev: number) => (prev - 1));
                        const totalCredits = (passenger.seats * Number(trip.price)).toString();
                        token && type === 'Approved' ? await putApproveTrip({ tripId: trip._id, bookingId, passengerId: passenger.userId, totalCredits }, token) : token && await putRejectTrip({ tripId: trip._id, bookingId, passengerId: passenger.userId, totalCredits }, token)
                    }
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        );
    }


    return (
        <View style={request.card}>
            <View style={request.header}>
                <View style={request.information}>
                    <Text style={request.name}>{passenger.name}</Text>
                    <View style={request.seats}>
                        <icons.MaterialCommunityIcons name="seat-passenger" size={18} color={COLORS.iconColor} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{passenger.seats}</Text>
                    </View>
                </View>
                <View style={request.status}>
                    <Text style={request.statusText}>Status:</Text>
                    <Text style={[request.passengerStatus, { color: statusColor }]}>{status}</Text>
                    {icon}
                </View>
            </View>
            {status === 'Pending' ? (
                <View style={request.footerContainer}>
                    <TouchableOpacity style={[request.button, { backgroundColor: COLORS.textColour }]} onPress={() => { handleSubmit('Approved') }}>
                        <Text style={request.buttonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[request.button, { backgroundColor: 'black' }]} onPress={() => { handleSubmit('Rejected') }}>
                        <Text style={request.buttonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={request.footerContainer}>
                    <TouchableOpacity style={request.contact} onPress={createConversation}>
                        <Text style={request.contactText}>Contact passenger</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default function ModalScreen() {
    const { trip, passengers } = useRoute().params as { trip: types.TTrip; passengers: types.TPassengerIDs[] };

    const [requests, setRequests] = useState<number>(passengers.filter((el: { status: string; }) => el.status === 'Pending').length)

    return (
        <View style={request.container}>
            <Text style={request.title}>{`You have ${requests} booking requests`}</Text>
            <FlatList
                data={passengers.slice().sort((a, b) => (a.status === 'Pending' ? -1 : b.status === 'Pending' ? 1 : 0))} //Sort so that 'Pending' is always first
                renderItem={({ item }) => (
                    <BookingCard trip={trip} passenger={item} bookingId={item.bookingId} setRequests={setRequests} />
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
        backgroundColor: COLORS.backgroundColor,
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
    contact: {
        backgroundColor: COLORS.iconColor,
        borderRadius: 25,
        borderColor: 'transparent',
        borderWidth: 1,
        width: '100%',
    },
    contactText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 3,
        color: '#fff'
    }
});
