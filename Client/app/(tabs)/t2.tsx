import { Alert, FlatList, ScrollView, StyleSheet, TouchableOpacity, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Switch, useColorScheme, TextInput } from 'react-native'
import * as icons from '@expo/vector-icons';
import CarPreview from '../../components/CarPreview';
import { Text, View } from '../../components/Themed';
import { Overlay } from '@rneui/themed';
import AddNewCar from '../../components/AddNewCar';
import * as types from '../../types/types'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';

import LocationSearch from '../../components/LocationSearch';
import moment from 'moment';
import { useMockData } from '../../mockData';
type Props = {}


const t2 = (props: Props) => {
    const [addNewCar, setAddNewCar] = useState<boolean>(false)

    const { setTrips, trips, mockUsers, setMockUsers } = useMockData()


    const [seatPrice, setSeatPrice] = useState<string>("")

    const [smokingToggled, setSmokingToggled] = useState<boolean>(false)
    const [childSeatToggled, setChildSeatToggled] = useState<boolean>(false)
    const [petsToggled, setPetsToggled] = useState<boolean>(false)
    const [alcoholToggled, setAlcoholToggled] = useState<boolean>(false)
    const [luggageToggled, setLuggageToggled] = useState<boolean>(false)
    const [commentsValue, setCommentsValue] = useState<string>('')
    const [selectedCar, setSelectedCar] = useState<types.TCar | null>(mockUsers[0].cars.length && mockUsers[0].cars[0] || null)


    const iconColor = useColorScheme() === 'light' ? 'black' : 'white'


    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [numberOfSeats, setNumberOfSeats] = useState(1);

    const styles = getDynamicStyles(iconColor);




    const handlePriceChange = (text: string) => {
        let newText = text.replace(/,/g, '.');

        // Check if the newText has more than one dot
        const splitText = newText.split('.');
        if (splitText.length > 2) {
            // If more than one dot, remove the last entered character
            newText = newText.slice(0, -1);
        }

        // Allow only two decimal places
        const formattedInput = newText.replace(/(\.\d{2})\d+/, '$1');
        setSeatPrice(formattedInput);
    }

    const [departure, setDeparture] = useState({})
    const [destination, setDestination] = useState({})

    const handleSubmit = () => {



        //calcualte approx time how much it will take, after move to if statement





        const combinedDateTime = moment(date).set({
            hour: moment(time).hour(),
            minute: moment(time).minute()
        });



        if (selectedCar && departure && destination && seatPrice && !combinedDateTime.isBefore(moment().add(2, 'hours'))) {

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
                    console.log(`Average Route Time (in seconds): ${averageDuration}`);
                }).then(() => {

                    const submitForm: types.TTrip = {
                        id: Math.random().toString(),
                        departure: {
                            country: departure.country,
                            city: departure.city,
                            address: departure.address,
                            time: moment(time).format('HH:mm')
                        },
                        destination: {
                            country: departure.country,
                            city: destination.city,
                            address: destination.address,
                            time: moment(time, 'HH:mm').add(averageDuration, 'seconds').format('HH:mm')
                        },

                        date: moment(date).format('YYYY-MM-DD'),

                        totalTime: moment().startOf('day').add(averageDuration, 'seconds').format('HH:mm'),

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
                        selectedCar,
                        price: seatPrice,
                        driverID: mockUsers[0].id,
                        passengersIDs: [],
                        succesful: false
                    }

                    setTrips([...trips, submitForm])
                    // refactor when server comes?
                    setMockUsers((prevState: types.TUser[]) => (prevState.map((user: types.TUser) =>
                        user.id === mockUsers[0].id
                            ? { ...user, tripsAsDriverIDs: [...user.tripsAsDriverIDs, submitForm.id] }
                            : user
                    )));



                })
                .catch(err => {
                    console.error(err);
                });




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


        <ScrollView
            automaticallyAdjustKeyboardInsets={true}
            style={styles.container}
            keyboardShouldPersistTaps={'handled'}
        >
            <Overlay
                isVisible={addNewCar}
                onBackdropPress={() => { setAddNewCar(false) }}
                animationType="fade">
                <AddNewCar setMockUsers={setMockUsers} setAddNewCar={setAddNewCar} mockUsers={mockUsers[0]} />
            </Overlay>

            <View style={styles.parameters}>
                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.MaterialIcons name='location-on' size={24} color={iconColor} />
                        <Text>From: </Text>
                    </View>
                    <View
                        style={{ width: '100%' }}>
                        <LocationSearch onPress={setDeparture} />
                    </View>
                    <View
                        style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.MaterialIcons name='location-searching' size={24} color={iconColor} />
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
                                } else {
                                    // Proceed with valid date and time
                                }






                            }
                            }
                            onCancel={() => setIsTimePickerVisible(false)}
                        // minimumDate={new Date()} 
                        />
                        <icons.FontAwesome5 name="clock" size={24} color="black" />
                        <Text style={styles.label}>{moment(time).format('HH:mm')}</Text>
                    </TouchableOpacity>
                    {/* todo forgot to add time */}




                </View>

                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.Ionicons name="ios-people" size={24} color={iconColor} />
                        <Text>Number of seats: </Text>
                    </View>
                    <RNPickerSelect
                        // TODO: modify onValueChange for form submit -> value doesn't go back to 0 after submitr
                        key={selectedCar && selectedCar.id}
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
                        <icons.MaterialCommunityIcons name='smoking' size={24} color={iconColor} />
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
                        <icons.MaterialCommunityIcons name='car-child-seat' size={24} color={iconColor} />
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
                        <icons.MaterialIcons name='pets' size={24} color={iconColor} />
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
                        <icons.FontAwesome5 name='wine-bottle' size={24} color={iconColor} />
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
                        <icons.MaterialIcons name='luggage' size={24} color={iconColor} />
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
                        <icons.MaterialIcons name='comment' size={24} color={iconColor} />
                        {/* <Text>Luggage</Text> */}
                        <Text>Additional Comments: </Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        editable
                        onChangeText={text => setCommentsValue(text)}
                        value={commentsValue}
                        placeholder="Type here..."
                    />
                </View>
            </View>

            <View style={styles.parameters}>

                <FlatList
                    data={mockUsers[0] && mockUsers[0].cars}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <CarPreview
                        item={item}
                        selectedCar={selectedCar}
                        setSelectedCar={setSelectedCar}
                        onPress={() => { setSelectedCar(item) }}
                    />}
                    // ItemSeparatorComponent={() => <View style={{ marginRight: 10 }} />}
                    ListFooterComponent={
                        <TouchableOpacity
                            style={styles.addNewCar}
                            onPress={() => setAddNewCar(true)}
                        >
                            <icons.FontAwesome name='plus' size={28} color={iconColor} />
                        </TouchableOpacity>
                    }
                />
            </View>
            <View style={styles.parameters}>
                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.MaterialIcons name='comment' size={24} color={iconColor} />
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
        </ScrollView>

    )
}

export default t2
const getDynamicStyles = (textColor: string) => {

    return StyleSheet.create({
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
            // borderWidth: 1,
            // borderRadius: 10,
            padding: 10,
            borderColor: '#a8a8a8'
        },
        iconContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10
        },
        parameters: {
            gap: 5,
            borderRadius: 10,
            // borderWidth: 1,
            borderColor: '#a8a8a8',
            padding: 5,
            marginBottom: 10
        },
        input: {
            height: 50,
            width: '100%',
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            borderColor: '#a8a8a8',
            color: textColor,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // textAlign: 'center',
        },

        currency: {
            position: 'absolute',
            left: 10, // Adjust the position as needed
            // Style your text as needed
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
            color: textColor,
            paddingLeft: 40
        },
        carsContainer: {

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
}



