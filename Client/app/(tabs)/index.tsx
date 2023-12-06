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
import COLORS from '../../COLORS';

const SearchForm = () => {
    if (GOOGLE_MAPS_API_KEY) { }
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
            <Image source={require('../../assets/images/EVAPPtv.png')} style={{ alignSelf: 'center', left: 20 }} />
            <Text style={styles.subtitle}>Welcome to EVAPP, please select your travel destination!</Text>
            <Image
                style={styles.image}
                source={require('../../assets/images/mainpic2.png')}
            />
            {/* something 
            
            // borderWidth: 1, borderColor: 'black',

            backgroundColor: COLORS.inputFields,
        shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.5,shadowRadius: 2,
            */}

            <View style={styles.parameters}>
                <View style={[styles.parameter, {
                    flexDirection: 'column', gap: 2, padding: 10, backgroundColor: COLORS.inputFields,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2, borderRadius: 8
                }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.MaterialIcons name='location-on' size={24} color={COLORS.iconColor} />
                        <Text style={styles.label}>From: </Text>
                    </View>
                    <View style={{ width: '100%' }}>
                        <GooglePlacesAutocomplete
                            styles={{
                                textInput: {
                                    borderBottomWidth: 1,
                                    borderBottomColor: COLORS.boarderBottomColor,
                                    fontSize: 18,
                                    backgroundColor: COLORS.inputFields
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
                                    city && setDeparture(prev => ({
                                        city: city,
                                        country: prev?.country || "",
                                    }));

                                    const country = details.address_components.find(component =>
                                        component.types.includes("country")
                                    )?.long_name;
                                    country && setDeparture(prev => ({
                                        city: prev?.city || "",
                                        country: country,
                                    }));

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
                        <icons.MaterialIcons name='location-searching' size={24} color={COLORS.iconColor} />
                        <Text style={styles.label}>To: </Text>
                    </View>
                    <View style={{ width: '100%' }}>
                        <GooglePlacesAutocomplete
                            styles={{
                                textInput: {
                                    borderBottomWidth: 1,
                                    borderBottomColor: COLORS.boarderBottomColor,
                                    fontSize: 18,
                                    backgroundColor: COLORS.inputFields
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
                                    city && setDestination(prev => ({
                                        city: city,
                                        country: prev?.country || ""
                                    }));

                                    const country = details.address_components.find(component =>
                                        component.types.includes("country")
                                    )?.long_name;
                                    country && setDestination(prev => ({
                                        city: prev?.city || "",
                                        country: country
                                    }));
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
                        <icons.FontAwesome name="calendar" size={24} color={COLORS.iconColor} />
                        <Text style={styles.label}>{moment(date).format('YYYY-MM-DD')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionContainer}>
                    <View style={styles.textInput}>
                        <icons.Ionicons name="ios-people" size={24} color={COLORS.iconColor} />
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
        textAlign: 'center',
        color: COLORS.textColour,

    },
    subtitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'normal',
        paddingVertical: 5,
    },
    image: {
        width: 200,
        height: 200,
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
        // borderWidth: 1,
        borderRadius: 8,
        // borderColor: 'black',
        backgroundColor: COLORS.inputFields,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,

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
        backgroundColor: COLORS.buttonBackground,
        borderRadius: 25,
        marginHorizontal: 60,
        marginVertical: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2
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