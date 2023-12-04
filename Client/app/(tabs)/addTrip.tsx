import { Alert, FlatList, ScrollView, StyleSheet, TouchableOpacity, Switch, TextInput, Text, View } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useFocusEffect, useNavigation } from 'expo-router';
import { Overlay } from '@rneui/themed';
import * as icons from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import { Snackbar } from 'react-native-paper';
import moment from 'moment';

import * as types from '../../types/types'


import CarPreview from '../../components/CarPreview';
import AddNewCar from '../../components/AddNewCar';
import LocationSearch from '../../components/LocationSearch';
import { useAuth } from '../../utils/auth';
import { addNewTrip, putTripsAsDriver } from '../../utils/apiService';


const addTrip = () => {
    const scrollViewRef = useRef<ScrollView | null>(null);
    const { user, token, isAuthenticated } = useAuth();

    useFocusEffect(
        React.useCallback(() => {
            //reset states when the screen comes in focus again. 

            setSelectedCar(null)
            setSeatPrice('')
            setSmokingToggled(false)
            setChildSeatToggled(false)
            setPetsToggled(false)
            setAlcoholToggled(false)
            setLuggageToggled(false)
            setCommentsValue("")
            setNumberOfSeats(1)
            setSnackBar(false)
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
        }, [])
    );

    const [addNewCar, setAddNewCar] = useState<boolean>(false)
    const [seatPrice, setSeatPrice] = useState<string>("")
    const [smokingToggled, setSmokingToggled] = useState<boolean>(false)
    const [childSeatToggled, setChildSeatToggled] = useState<boolean>(false)
    const [petsToggled, setPetsToggled] = useState<boolean>(false)
    const [alcoholToggled, setAlcoholToggled] = useState<boolean>(false)
    const [luggageToggled, setLuggageToggled] = useState<boolean>(false)
    const [commentsValue, setCommentsValue] = useState<string>('')
    const [selectedCar, setSelectedCar] = useState<types.TCar | types.TCarNoId | null>(user && user.cars.length && user.cars[0] || null)
    const [departure, setDeparture] = useState<types.TDeparture | null>(null)
    const [destination, setDestination] = useState<types.TDestination | null>(null)
    const [snackBar, setSnackBar] = useState<boolean>(false)
    const [addCarSnackBar, setAddCarSnackBar] = useState<boolean>(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState<boolean>(false);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [numberOfSeats, setNumberOfSeats] = useState<number>(1);

    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            if (!isAuthenticated) {
                navigation.navigate('login');
            }
        }, [isAuthenticated])
    );

    const handlePriceChange = (text: string) => {
        let newText = text.replace(/,/g, '.');
        const splitText = newText.split('.');
        if (splitText.length > 2) {
            newText = newText.slice(0, -1);
        }

        const formattedInput = newText.replace(/(\.\d{2})\d+/, '$1');
        setSeatPrice(formattedInput);
    }


    const handleSubmit = () => {

        const combinedDateTime = moment(date).set({
            hour: moment(time).hour(),
            minute: moment(time).minute()
        });

        if (user && token && selectedCar && departure && destination && seatPrice && !combinedDateTime.isBefore(moment().add(2, 'hours'))) {
            setSnackBar(true)

            let averageDuration = 0


            fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${departure.city}&destination=${destination.city}&key=AIzaSyBKyJV9kEv1bofDeXIzMvp2UpDq0bHWSBM`)
                .then(response => response.json())
                .then(data => {
                    let totalDuration = 0;
                    data.routes.forEach(route => {
                        route.legs.forEach(leg => {
                            totalDuration += leg.duration.value; // duration in seconds
                        });
                    });
                    averageDuration = totalDuration / data.routes.length;
                }).then(() => {


                    const duration = moment.duration(averageDuration, 'seconds');
                    const hours = Math.floor(duration.asHours()).toString();
                    const formattedHours = hours.length === 1 ? `0${hours}` : hours;
                    const minutes = duration.minutes().toString();
                    const formattedMinutes = minutes.length === 1 ? `0${minutes}` : minutes;

                    const formattedTime = `${formattedHours}:${formattedMinutes}`;


                    const submitForm: types.TTripNoId = {
                        departure: {
                            country: departure.country,
                            city: departure.city,
                            address: departure.address,
                            time: moment(time).format('HH:mm'),
                            date: moment(date).format('YYYY-MM-DD')
                        },
                        destination: {
                            country: destination.country,
                            city: destination.city,
                            address: destination.address,
                            time: moment(time, 'HH:mm').add(averageDuration, 'seconds').format('HH:mm'),
                            date: moment(combinedDateTime, 'HH:mm').add(averageDuration, 'seconds').format('YYYY-MM-DD'),
                        },
                        date: moment(date).format('YYYY-MM-DD'),
                        totalTime: formattedTime,
                        seats: {
                            available: numberOfSeats,
                            total: selectedCar.seats
                        },
                        services: {
                            smoking: smokingToggled,
                            childSeat: childSeatToggled,
                            pets: petsToggled,
                            alcohol: alcoholToggled,
                            luggage: luggageToggled,
                            comments: commentsValue,
                        },
                        car: selectedCar,
                        price: seatPrice,
                        driverID: user.userId,
                        passengersIDs: [],
                        successful: false
                    }

                    addNewTrip(submitForm, token).then((data) => {
                        putTripsAsDriver({ _id: data.trip._id }, token)
                    })

                })
                .catch(err => {
                    console.error(err);
                });

            navigation.navigate('history');



        } else {
            Alert.alert('Missing fields', 'Please fill in all mandatory fields');
        }

    }
    const [seatOptions, setSeatOptions] = useState<{ label: string; value: number }[]>([]);

    useEffect(() => {
        if (selectedCar) {

            const seats = selectedCar.seats;
            const newSeatOptions = [];
            for (let i = 2; i <= seats; i++) {
                newSeatOptions.push({ label: `${i}`, value: i });
            }
            setSeatOptions(newSeatOptions);
        };
        setNumberOfSeats(1); // Reset number of seats when selected car changes
    }, [selectedCar])
    return (


        token && user && <ScrollView
            ref={scrollViewRef}
            automaticallyAdjustKeyboardInsets={true}
            style={styles.container}
            keyboardShouldPersistTaps={'handled'}
        >

            <Overlay
                isVisible={addNewCar}
                onBackdropPress={() => { setAddNewCar(false) }}
                animationType="fade">
                <AddNewCar setAddNewCar={setAddNewCar} setAddCarSnackBar={setAddCarSnackBar} />
            </Overlay>

            <View style={styles.parameters}>
                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.MaterialIcons name='location-on' size={24} color={"black"} />
                        <Text>From: </Text>
                    </View>
                    <View
                        style={{ width: '100%' }}>
                        <LocationSearch onPress={setDeparture} />
                    </View>
                    <View
                        style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.MaterialIcons name='location-searching' size={24} color={"black"} />
                        <Text>To: </Text>
                    </View>
                    <View
                        style={{ width: '100%' }}>
                        <LocationSearch onPress={setDestination} />
                    </View>




                </View>
                <View style={styles.parameter}>
                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={[styles.input, { width: '45%', }]}>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={(selectedDate: Date) => {
                                setDatePickerVisibility(false)
                                setDate(selectedDate);
                                setTimeout(() => {
                                    setIsTimePickerVisible(true);
                                }, 500)
                            }
                            }
                            onCancel={() => setDatePickerVisibility(false)}
                            minimumDate={new Date()} // Set the minimum date to today
                        />
                        <icons.FontAwesome name="calendar" size={24} color="black" />
                        <Text style={styles.label}>{moment(date).format('YYYY-MM-DD')}</Text>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => setIsTimePickerVisible(true)} style={[styles.input, { width: '45%', }]}>
                        <DateTimePickerModal
                            isVisible={isTimePickerVisible}
                            mode="time"
                            onConfirm={(selectedTime: Date) => {
                                setIsTimePickerVisible(false)
                                setTime(selectedTime);
                                const combinedDateTime = moment(date).set({
                                    hour: moment(selectedTime).hour(),
                                    minute: moment(selectedTime).minute()
                                });

                                if (combinedDateTime.isBefore(moment().add(2, 'hours'))) {
                                    Alert.alert('Invalid Selection', 'You cannot select a date/time less than 2 hours in the future.');
                                }
                            }
                            }
                            onCancel={() => setIsTimePickerVisible(false)}
                        />
                        <icons.FontAwesome5 name="clock" size={24} color="black" />
                        <Text style={styles.label}>{moment(time).format('HH:mm')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.Ionicons name="ios-people" size={24} color={"black"} />
                        <Text>Number of seats: </Text>
                    </View>
                    <RNPickerSelect
                        key={selectedCar && selectedCar._id}
                        onValueChange={(value) => { setNumberOfSeats(value) }}
                        style={{
                            inputIOS: styles.input,
                            inputAndroid: styles.input,
                        }}
                        placeholder={{
                            label: '1',
                            value: 1,
                        }}
                        items={seatOptions}
                    />
                </View>

            </View>

            <View style={styles.parameters}>
                <View style={styles.parameter}>
                    <View style={styles.iconContainer}>
                        <icons.MaterialCommunityIcons name='smoking' size={24} color={"black"} />
                        <Text>Smoking</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { setSmokingToggled(!smokingToggled) }}
                        value={smokingToggled}
                    />
                </View>
                <View style={styles.parameter}>
                    <View style={styles.iconContainer}>
                        <icons.MaterialCommunityIcons name='car-child-seat' size={24} color={"black"} />
                        <Text>Child Seat</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { setChildSeatToggled(!childSeatToggled) }}
                        value={childSeatToggled}
                    />
                </View>
                <View style={styles.parameter}>
                    <View style={styles.iconContainer}>
                        <icons.MaterialIcons name='pets' size={24} color={"black"} />
                        <Text>Pets</Text>
                    </View>

                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { setPetsToggled(!petsToggled) }}
                        value={petsToggled}
                    />
                </View>
                <View style={styles.parameter}>
                    <View style={styles.iconContainer}>
                        <icons.FontAwesome5 name='wine-bottle' size={24} color={"black"} />
                        <Text>Alcohol</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { setAlcoholToggled(!alcoholToggled) }}
                        value={alcoholToggled}
                    />
                </View>
                <View style={styles.parameter}>
                    <View style={styles.iconContainer}>
                        <icons.MaterialIcons name='luggage' size={24} color={"black"} />
                        <Text>Luggage</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { setLuggageToggled(!luggageToggled) }}
                        value={luggageToggled}
                    />
                </View>
                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.MaterialIcons name='comment' size={24} color={"black"} />
                        <Text>Additional Comments: </Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        editable
                        onChangeText={text => setCommentsValue(text)}
                        value={commentsValue}
                        placeholder="Type here..."
                        placeholderTextColor="#838383"

                    />
                </View>
            </View>

            <View style={styles.parameters}>

                <FlatList
                    data={user && user.cars}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <CarPreview
                        item={item}
                        selectedCar={selectedCar}
                        setSelectedCar={setSelectedCar}
                        onPress={() => { setSelectedCar(item) }}
                    />}
                    ListFooterComponent={
                        <TouchableOpacity
                            style={styles.addNewCar}
                            onPress={() => setAddNewCar(true)}
                        >
                            <icons.FontAwesome name='plus' size={28} color={"black"} />
                        </TouchableOpacity>
                    }
                />
            </View>
            <View style={styles.parameters}>
                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.MaterialIcons name='comment' size={24} color={"black"} />
                        <Text>Price per seat</Text>
                    </View>
                    <View style={styles.priceContainer}>

                        <Text style={styles.currency}>EUR</Text>

                        <TextInput
                            style={styles.inputPrice}
                            keyboardType="decimal-pad"
                            placeholder='Enter price per seat'
                            onChangeText={handlePriceChange}
                            value={seatPrice}
                            placeholderTextColor="#838383"

                        />
                    </View>

                </View>
            </View>

            <TouchableOpacity
                style={styles.btn}
                onPress={handleSubmit}
            >
                <Text >Create a trip</Text>
            </TouchableOpacity>
            <Snackbar
                visible={snackBar}
                onDismiss={() => setSnackBar(false)}
                style={{ backgroundColor: 'green', }}
            >
                <Text style={{ textAlign: 'center' }}>
                    The trip has been created succefully!
                </Text>
            </Snackbar>
            <Snackbar
                visible={addCarSnackBar}
                onDismiss={() => setAddCarSnackBar(false)}
                action={{
                    label: 'Okay',
                    onPress: () => {
                        setAddCarSnackBar(false)
                    },
                }}
                style={{ backgroundColor: 'green', }}
            >
                <Text style={{ textAlign: 'center' }}>
                    The car has been created succefully!
                </Text>
            </Snackbar>
        </ScrollView>

    )
}

export default addTrip
const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        textAlign: 'center',
    },
    
    btn: {
        backgroundColor: 'red',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20
    },

    container: {
        padding: 10,
        flex: 1
    },

    parameter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderColor: '#a8a8a8',
    },

    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    parameters: {
        gap: 5,
        borderRadius: 10,
        borderColor: '#a8a8a8',
        padding: 5,
        marginBottom: 10,
        backgroundColor: '#fff'
    },

    input: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: '#a8a8a8',
        color: "black",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    currency: {
        position: 'absolute',
        left: 10, 
    },
    
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    inputPrice: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: '#a8a8a8',
        color: "black",
        paddingLeft: 40
    },

    addNewCar: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#a8a8a8',
        height: 100,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
    }
})




