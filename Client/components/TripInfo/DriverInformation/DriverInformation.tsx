import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import * as icons from '@expo/vector-icons';

import * as types from '../../../types/types'
import { postChat } from '../../../utils/apiService';
import { useAuth } from '../../../utils/auth';
import { useNavigation } from 'expo-router';
import COLORS from '../../../COLORS';

type Props = {
    trip: types.TTrip,
    driver: types.TUser
}

const DriverInformation = ({ trip, driver }: Props) => {
    const { user, token } = useAuth();
    const { navigate } = useNavigation();

    const createConversation = async () => {
        await postChat(trip.driverID, user.userId, token);
        navigate('messages')
    }
    return (
        <View style={driver_style.container}>
            <View style={driver_style.header}>
                <View style={driver_style.profile}>
                    <View>
                        <Text style={driver_style.profileName}>{driver.name}</Text>
                    </View>
                    <View style={driver_style.profileInformation}>
                        <View style={driver_style.rating}>
                            <Text style={driver_style.ratingText}>{`${driver.driverRating.totalReviews} reviews • ${driver.driverRating.averageRating}`}</Text>
                            <icons.AntDesign name='star' size={12} color={COLORS.iconColor} />
                        </View>
                        <TouchableOpacity>
                            {driver.imageUrl ? <Image source={{ uri: driver.imageUrl }} style={{ height: 40, width: 40, borderRadius: 50 }} /> :
                                <icons.AntDesign name="user" size={50} color="black" style={{ height: 40, width: 40, borderRadius: 50 }} />}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={driver_style.carContainer}>
                <Text style={driver_style.carName}>{trip.car.model}</Text>
                <View style={driver_style.carInformation}>
                    <View style={driver_style.carInformationItem}>
                        <Text style={driver_style.carInformationItemText}>Color:</Text>
                        <Text style={driver_style.carInformationItemValue}>{trip.car.color}</Text>
                    </View>
                    <View style={driver_style.carInformationItem}>
                        <Text style={driver_style.carInformationItemText}>Seats:</Text>
                        <Text style={driver_style.carInformationItemValue}>{trip.car.seats}</Text>
                    </View>
                </View>
                <View style={driver_style.carInformation}>
                    <View style={driver_style.carInformationItem}>
                        <Text style={driver_style.carInformationItemText}>Number plate:</Text>
                        <Text style={driver_style.carInformationItemValue}>{trip.car.licencePlate}</Text>
                    </View>
                    <View style={driver_style.carInformationItem}>
                        <Text style={driver_style.carInformationItemText}>Seats available:</Text>
                        <Text style={driver_style.carInformationItemValue}>{trip.seats.available}</Text>
                    </View>
                </View>
            </View>
            <View style={driver_style.serviceContainer}>
                <Text style={driver_style.serviceTitle}>Services</Text>
                <View style={driver_style.serviceTable}>
                    <View style={driver_style.serviceInformationLeft}>
                        <View style={driver_style.serviceInformationItem}>
                            <icons.MaterialCommunityIcons name='smoking' size={24} color={COLORS.iconColor} />
                            <Text style={driver_style.serviceInformationItemText}>{trip.services.smoking ? 'Smoking allowed' : 'No smoking'}</Text>
                        </View>
                        <View style={driver_style.serviceInformationItem}>
                            <icons.MaterialCommunityIcons name='car-child-seat' size={24} color={COLORS.iconColor} />
                            <Text style={driver_style.serviceInformationItemText}>{trip.services.childSeat ? 'Has a child seat' : 'No child seat'}</Text>
                        </View>
                        <View style={driver_style.serviceInformationItem}>
                            <icons.MaterialIcons name='pets' size={24} color={COLORS.iconColor} />
                            <Text style={driver_style.serviceInformationItemText}>{trip.services.pets ? 'Pets allowed' : 'No pets'}</Text>
                        </View>
                        <View style={driver_style.serviceInformationItem}>
                            <icons.FontAwesome5 name='wine-bottle' size={24} color={COLORS.iconColor} />
                            <Text style={driver_style.serviceInformationItemText}>{trip.services.alcohol ? 'Alcohol allowed' : 'No alcohol'}</Text>
                        </View>
                    </View>
                    <View style={driver_style.serviceInformationRight}>
                        <View style={driver_style.serviceInformationItem}>
                            <icons.MaterialIcons name='luggage' size={24}  color={COLORS.iconColor}/>
                            <Text style={driver_style.serviceInformationItemText}>{trip.services.luggage ? 'Luggage allowed' : 'No luggage'}</Text>
                        </View>
                        <View style={[driver_style.serviceInformationItem, { marginTop: 10 }]}>
                            <icons.MaterialIcons name="insert-comment" size={24} color={COLORS.iconColor} style={{ marginBottom: 75 }} />
                            <Text style={driver_style.serviceInformationCommentText}>{trip.services.comments || 'No comment'}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={driver_style.contactContainer}>
                <TouchableOpacity style={driver_style.contactButton} onPress={createConversation}>
                    <Text style={driver_style.contactText}>Contact driver</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}

export default DriverInformation;

const driver_style = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '95%',
        height: 510,
        position: 'relative',
        borderColor: '#a8a8a8',
        borderRadius: 15,
        padding: 10,
        margin: 10,
        marginTop: 10,
        marginBottom: 100
    },
    header: {
        width: '100%'
    },
    profile: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 10
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    profileInformation: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
    },
    rating: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5
    },
    ratingText: {
        fontWeight: '600'
    },
    information: {
        width: '100%',
        height: 45
    },
    name: {
        fontSize: 22,
        fontWeight: '600'
    },
    carContainer: {
        width: '100%',
        height: 130,
        backgroundColor: COLORS.inputFields,
        borderColor: '#a8a8a8',
        borderRadius: 15,
        padding: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        hadowRadius: 2
    },
    carName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    carInformation: {
        backgroundColor: COLORS.inputFields,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10
    },
    carInformationItem: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        gap: 5,
        backgroundColor: COLORS.inputFields,
    },
    carInformationItemText: {
        fontSize: 13,
        fontStyle: 'italic'
    },
    carInformationItemValue: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    serviceContainer: {
        width: '100%',
        height: 200,
        backgroundColor: COLORS.inputFields,
        borderColor: '#a8a8a8',
        borderRadius: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        hadowRadius: 2
    },
    serviceTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    serviceTable: {
        backgroundColor: COLORS.inputFields,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 40
    },
    serviceInformationLeft: {
        backgroundColor: COLORS.inputFields,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        marginTop: 10
    },
    serviceInformationRight: {
        backgroundColor: COLORS.inputFields,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    serviceInformationItem: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
        backgroundColor: COLORS.inputFields,
        marginBottom: 10
    },
    serviceInformationItemText: {
        fontSize: 13,
        fontStyle: 'italic'
    },
    serviceInformationCommentText: {
        fontSize: 13,
        fontStyle: 'italic',
        width: 100,
        height: 100,
    },
    contactContainer: {
        width: '100%',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f2f2f2',
        borderColor: '#a8a8a8',
        borderRadius: 15,
    },
    contactButton: {
        height: 50,
        width: '100%',
        backgroundColor: COLORS.iconColor,
        opacity: 0.8,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    }
});