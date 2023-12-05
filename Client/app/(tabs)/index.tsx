import React, { useState } from 'react';
import moment from 'moment';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as icons from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../utils/auth';
import { getFilteredTrips } from '../../utils/apiService';
import { GOOGLE_MAPS_API_KEY } from "@env";
import * as types from '../../types/types'

const SearchForm = () => {

    const { token } = useAuth();
    const [departure, setDeparture] = useState<types.TDeparture | undefined>(undefined);
    const [destination, setDestination] = useState<types.TDestination | undefined>(undefined);
    const [date, setDate] = useState<Date>(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
    const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const navigation = useNavigation();

    const handleConfirm = (selectedDate: Date) => {
        setDatePickerVisibility(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };


    const handleSubmit = async () => {
        if (departure) {

            setIsLoading(true);
            const formData = {
                departure,
                destination,
                date: moment(date).format('YYYY-MM-DD'),
                numberOfPeople,
            };

            const response = await getFilteredTrips({
                departure: formData.departure,
                destination: formData.destination,
                date: formData.date,
                seats: formData.numberOfPeople
            }, token);
            if (response) {
                navigation.navigate('TripCardRedirect', { response });
            }

            // simulate a delay (e.g., 2000 milliseconds) before resetting the form
            setTimeout(() => {
                setIsLoading(false); // set loading to false to hide the spinner
            }, 2000);
        } else {
            Alert.alert('Missing fields', 'Please fill in departure!')
        }

    };


    return (
        <ScrollView
            automaticallyAdjustKeyboardInsets={true}
            keyboardShouldPersistTaps={'handled'}
            style={styles.container}>
            <Text style={styles.title}>EVAPP</Text>
            <Text style={styles.subtitle}>Welcome to EVAPP, please select your travel destination!</Text>
            <Image
                style={styles.image}
                source={require('../../assets/images/evapp.jpeg')}
            />

            <View style={styles.parameters}>
                <View style={[styles.parameter, { flexDirection: 'column', gap: 2, borderWidth: 1, borderColor: 'black', padding: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.MaterialIcons name='location-on' size={24} color='black' />
                        <Text style={styles.label}>From: </Text>
                    </View>
                    <View style={{ width: '100%' }}>
                        <GooglePlacesAutocomplete
                            styles={{
                                textInput: {
                                    borderBottomWidth: 1,
                                    fontSize: 18,
                                }
                            }}
                            textInputProps={{
                                placeholderTextColor: '#838383',
                            }}
                            placeholder='Search'
                            minLength={2}
                            fetchDetails={true}

                            onPress={(data, details = null) => {
                                if (details) {
                                    const city = details.address_components.find(component =>
                                        component.types.includes("locality")
                                    )?.long_name;
                                    city && setDeparture(prev => ({ ...prev || {}, city }));

                                    const country = details.address_components.find(component =>
                                        component.types.includes("country")
                                    )?.long_name;
                                    country && setDeparture(prev => ({ ...prev, country }));
                                }

                            }}
                            query={{
                                key: GOOGLE_MAPS_API_KEY,
                                language: 'en',
                            }}
                            disableScroll={true}
                            enablePoweredByContainer={false}
                        />
                    </View>



                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.MaterialIcons name='location-searching' size={24} color='black' />
                        <Text style={styles.label}>To: </Text>
                    </View>
                    <View style={{ width: '100%' }}>
                        <GooglePlacesAutocomplete
                            styles={{
                                textInput: {
                                    borderBottomWidth: 1,
                                    fontSize: 18,
                                }
                            }}
                            textInputProps={{
                                placeholderTextColor: '#838383',
                            }}
                            placeholder='Search'
                            minLength={2}
                            fetchDetails={true}

                            onPress={(data, details = null) => {
                                if (details) {
                                    let city = details.address_components.find(component =>
                                        component.types.includes("locality")
                                    )?.long_name;
                                    city && setDestination(prev => ({ ...prev, city }));

                                    const country = details.address_components.find(component =>
                                        component.types.includes("country")
                                    )?.long_name;
                                    country && setDestination(prev => ({ ...prev, country }));
                                }
                            }}
                            query={{
                                key: GOOGLE_MAPS_API_KEY,
                                language: 'en',
                            }}
                            disableScroll={true}
                            enablePoweredByContainer={false}
                        />
                    </View>
                </View>
            </View>


            <View style={styles.doubleSectionContainer}>
                <View style={styles.sectionContainer}>
                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.textInput}>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={() => setDatePickerVisibility(false)}
                            minimumDate={new Date()} // Set the minimum date to today
                        />
                        <icons.FontAwesome name="calendar" size={24} color="black" />
                        <Text style={styles.label}>{moment(date).format('YYYY-MM-DD')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionContainer}>
                    <View style={styles.textInput}>
                        <icons.Ionicons name="ios-people" size={24} color="black" />
                        <RNPickerSelect
                            onValueChange={(value) => setNumberOfPeople(value)}
                            items={[
                                { label: '2', value: 2 },
                                { label: '3', value: 3 },
                                { label: '4', value: 4 },
                            ]}
                            placeholder={{
                                label: '1',
                                value: 1,
                            }}
                            style={{
                                inputIOS: {
                                    fontSize: 18,
                                    paddingVertical: 12,
                                    paddingHorizontal: 10,
                                    paddingRight: 55,
                                    color: "#838383"
                                },
                                inputAndroid: {
                                    fontSize: 18,
                                    paddingVertical: 12,
                                    paddingHorizontal: 10,
                                    paddingRight: 55,
                                    color: "#838383"

                                },
                            }}
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Let's go</Text>
                )}
            </TouchableOpacity>

        </ScrollView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'

    },
    subtitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'normal',
        paddingVertical: 5,
    },
    image: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        resizeMode: 'contain',
        padding: 0
    },
    label: {
        fontSize: 18,
        textAlign: 'center',
    },
    textInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 18,
        padding: 10,
        width: 152,
        height: 60,
        borderWidth: 1,
    },
    doubleSectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    sectionContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 25,
        marginHorizontal: 60,
        marginVertical: 20,
        padding: 15,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'normal',
        color: '#fff',
    },
    parameter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        borderColor: '#a8a8a8',
        marginBottom: 10
    },
});

export default SearchForm;