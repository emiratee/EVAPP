import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text, View } from '../components/Themed';
import * as icons from '@expo/vector-icons';
import { Picker } from 'react-native-wheel-pick';
import Bill from '../components/Bill';
import { useMockData } from '../utils/mockData';


const LocationInformation = () => {
    const { trip } = useRoute().params
    return (
        <View style={styles.locationContainer}>
            <View style={styles.timeContainer}>
                <View>
                    <Text style={styles.time}>{trip.departure.time}</Text>
                </View>
                <View>
                    <Text style={styles.totalTime}>{trip.totalTime}</Text>
                </View>
                <View>
                    <Text style={styles.time}>{trip.destination.time}</Text>
                </View>
            </View>
            <View style={styles.dotContainer}>
                <View style={styles.dot}>
                    <View style={styles.line}></View>
                </View>
                <View style={styles.dot}></View>
            </View>
            <View style={styles.addressContainer}>
                <View style={styles.mainContainer}>
                    <Text style={styles.address}>{trip.departure.address}</Text>
                    <Text style={styles.city}>{trip.departure.city}</Text>
                </View>
                <View style={styles.mainContainer}>
                    <Text style={styles.address}>{trip.destination.address}</Text>
                    <Text style={styles.city}>{trip.destination.city}</Text>
                </View>
            </View>
        </View>
    )
}

const DriverInformation = ({ trip, driver }) => {
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
                            <icons.AntDesign name='star' size={12} />
                        </View>
                        <TouchableOpacity>
                            <Image
                                source={require('../assets/images/driver.png')}
                                style={{ height: 40, width: 40, borderRadius: 50 }}
                            />
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
                            <icons.MaterialCommunityIcons name='smoking' size={24} />
                            <Text style={driver_style.serviceInformationItemText}>{trip.services.smoking ? 'Smoking allowed' : 'No smoking'}</Text>
                        </View>
                        <View style={driver_style.serviceInformationItem}>
                            <icons.MaterialCommunityIcons name='car-child-seat' size={24} />
                            <Text style={driver_style.serviceInformationItemText}>{trip.services.childSeat ? 'Has a child seat' : 'No child seat'}</Text>
                        </View>
                        <View style={driver_style.serviceInformationItem}>
                            <icons.MaterialIcons name='pets' size={24} />
                            <Text style={driver_style.serviceInformationItemText}>{trip.services.pets ? 'Pets allowed' : 'No pets'}</Text>
                        </View>
                        <View style={driver_style.serviceInformationItem}>
                            <icons.FontAwesome5 name='wine-bottle' size={24} />
                            <Text style={driver_style.serviceInformationItemText}>{trip.services.alcohol ? 'Alcohol allowed' : 'No alcohol'}</Text>
                        </View>
                    </View>
                    <View style={driver_style.serviceInformationRight}>
                        <View style={driver_style.serviceInformationItem}>
                            <icons.MaterialIcons name='luggage' size={24} />
                            <Text style={driver_style.serviceInformationItemText}>{trip.services.luggage ? 'Luggage allowed' : 'No luggage'}</Text>
                        </View>
                        <View style={[driver_style.serviceInformationItem, { marginTop: 10 }]}>
                            <icons.MaterialIcons name="insert-comment" size={24} color="black" style={{ marginBottom: 75 }} />
                            <Text style={driver_style.serviceInformationCommentText}>{trip.services.comments || 'No comment'}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={driver_style.contactContainer}>
                <TouchableOpacity style={driver_style.contactButton}>
                    <Text style={driver_style.contactText}>Contact driver</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}

// here, we may want to pass also the navigation as a prop besides 'trip' and pass it to <Bill navigation={navigation}/> 
const Request = ({ trip }) => {
    const { mockUsers } = useMockData();

    const [price, setPrice] = useState(trip.price);
    const [isPickerVisible, setIsPickerVisible] = useState(true);
    const [text, setText] = useState(`${parseFloat(price).toFixed(2)}€`);
    const [seats, setSeats] = useState(1);
    const [hasEnoughCredits, setHasEnoughCredits] = useState(true);

    const handlePriceChange = (value: string) => {
        const number: number = parseFloat(value);
        const price: number = parseFloat((trip.price * number).toFixed(2));
        setPrice(price.toString());
        setText(`${price.toFixed(2)}€`);
        setSeats(number);
    }

    const createPickerDataArray = () => {
        return Array.from({ length: trip.seats.total }, (_, index) => index < trip.seats.available ? (index + 1).toString() : '').slice(0, trip.seats.available);
    }


    const handleButtonClick = () => {
        // additional logic to execute when the button is clicked
        setHasEnoughCredits(parseFloat(mockUsers[0].credits) >= price);
        setIsPickerVisible(false);
        setText('Request Service');
    }

    return (
        <View style={request_styles.container}>
            <TouchableOpacity style={
                [request_styles.buttonContainer,
                !isPickerVisible && { width: '95%', marginLeft: '2.5%', },
                hasEnoughCredits ? {} : request_styles.disabledButton,
                ]}
                onPress={handleButtonClick}
                disabled={!hasEnoughCredits}
            >
                <View style={request_styles.button}>
                    <Text style={request_styles.buttonText}>{text}</Text>
                </View>
            </TouchableOpacity>

            {!isPickerVisible && (<Bill trip={trip} price={price} seats={seats} setIsPickerVisible={setIsPickerVisible} hasEnoughCredits={hasEnoughCredits} mockUser={mockUsers[0]} />)}

            {isPickerVisible && (<Picker
                style={request_styles.picker}
                selectedValue='1'
                pickerData={createPickerDataArray()}
                onValueChange={(value: string) => { handlePriceChange(value) }}
                itemStyle={request_styles.pickerItem}
            />)}
        </View>
    )
}
export default function ModalScreen() {
    const { trip, driver } = useRoute().params;

    return (
        <View style={styles.container}>
            <FlatList
                data={[trip]}
                renderItem={({ item }) => (
                    <>
                        <LocationInformation trip={item} />
                        <DriverInformation trip={item} driver={driver} />
                    </>
                )}
                keyExtractor={(item, index) => index.toString()}
                style={{ width: '100%', height: '100%' }}
            />
            <Request trip={trip} />
        </View>
    );
}

const request_styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 15,
        width: '100%',
        height: 75,
        position: 'absolute',
        bottom: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 15,
        padding: 10,
        margin: 10
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '75%',
        height: '100%',
        borderColor: '#a8a8a8',
        borderRadius: 10,
        backgroundColor: '#000'
    },
    button: {
        // backgroundColor: '#000',
        backgroundColor: 'transparent',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    disabledButton: {
        backgroundColor: '#b0aeae', // Set your desired background color for the disabled state
    },
    picker: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        width: '20%',
        height: '100%'
    },
    pickerItem: {
        fontSize: 20,
        height: 50,
        color: 'black',
        textAlign: 'center',
    }
});

const driver_style = StyleSheet.create({
    container: {
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
        marginBottom: 10
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
        backgroundColor: '#f2f2f2',
        borderColor: '#a8a8a8',
        borderRadius: 15,
        padding: 10,
        marginBottom: 20
    },
    carName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    carInformation: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10
    },
    carInformationItem: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        gap: 5,
        backgroundColor: '#f2f2f2',
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
        backgroundColor: '#f2f2f2',
        borderColor: '#a8a8a8',
        borderRadius: 15,
        padding: 10
    },
    serviceTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    serviceTable: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 40
    },
    serviceInformationLeft: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        marginTop: 10
    },
    serviceInformationRight: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    serviceInformationItem: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
        backgroundColor: '#f2f2f2',
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
        width: '60%',
        backgroundColor: '#000',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold'
    }
});

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
        height: 175,
        position: 'relative',
        borderColor: '#a8a8a8',
        borderRadius: 15,
        padding: 10,
        margin: 10,
        marginBottom: 10
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
    city: {
        fontSize: 14,
        fontWeight: '400'
    },
    address: {
        fontSize: 18,
        fontWeight: '600'
    },
    time: {
        fontSize: 16,
        fontWeight: '200'
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
});