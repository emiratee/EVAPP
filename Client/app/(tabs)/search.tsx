// Import necessary libraries and components
import React, { useState } from 'react';
import moment from 'moment';
import {GOOGLE_MAPS_API_KEY} from "@env";

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// Define the functional component
const TravelForm: React.FC = () => {
  // State to hold the selected locations, date, and number of people
  const [currentLocation, setCurrentLocation] = useState(null);
  const [desiredLocation, setDesiredLocation] = useState(null);
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState('');



  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    hideDatePicker();
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  

  // Function to handle form submission
  const handleSubmit = () => {
    // Process the form data (you can customize this part based on your needs)
    console.log('Current Location:', currentLocation);
    console.log('Desired Location:', desiredLocation);
    console.log('Travel Date:', moment(date).format('YYYY-MM-DD'));
    console.log('Number of People:', numberOfPeople);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EVAPP</Text>
      <Text style={styles.subtitle}>Welcome to EVAPP, please select your travel destination!</Text>
      <Image
        style={styles.image}
        source={require('../../assets/images/evapp.jpeg')}
      />
      {/* Current Location Input */}
      <TextInput style={styles.locationInput} placeholder="  Current location"></TextInput>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' contains additional information about the selected place.
          setCurrentLocation(details);
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'en',
        }}
        currentLocation={true}
        currentLocationLabel="Current Location"
      />

      {/* Desired Location Input */}
      <TextInput style={styles.locationInput} placeholder="  Desired location"></TextInput>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' contains additional information about the selected place.
          setDesiredLocation(details);
        }}
        query={{
          key: process.env('GOOGLE_MAPS_API_KEY'),
          language: 'en',
        }}
      />

      <View style={styles.doubleSectionContainer}>
        {/* Date Input */}
        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Select Travel Date:</Text>
          <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
            <Text style={styles.label}>{moment(date).format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            // display="spinner"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={new Date()} // Set the minimum date to today
          />
        </View>

        {/* Number of People Input */}
        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Select No. of People:</Text>
          {/* <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            placeholder="No."
          /> */}
          <View style={styles.textInput}>
            <RNPickerSelect
              onValueChange={(value) => console.log(value)}
              items={[
                  { label: '1', value: '1' },
                  { label: '2', value: '2' },
                  { label: '3', value: '3' },
                  { label: '4', value: '4' },
              ]}
              placeholder={{
                label: '0',
                value: '0',
              }}
            />
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Let's go</Text></TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
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
    fontSize: 16,
    fontWeight: 'normal',
    paddingVertical: 10,
  },
  locationInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  doubleSectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  datePicker: {
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    paddingVerticla: 10,
    paddingHorizontal: 40
    
  },
  textInput: {
    fontSize: 16,
    textAlign:'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 147,
    height: 40,
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 5,
    marginHorizontal: 60,
    marginVertical: 35,
    padding: 15,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'normal',
    color: '#fff',

  }
});

// Export the component
export default TravelForm;