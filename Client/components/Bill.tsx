import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as icons from '@expo/vector-icons';

const mockUserCredits = {
  name: 'Socker',
  email: 'socker@randommail.com',
  phoneNumber: '0123456789',
  credits: 20
}


const Bill: React.FC = ({ trip, price, seats, setIsPickerVisible }) => {
  //console.log(trip, price, seats);
  const formattedPrice = parseFloat(price).toFixed(2);
  const hasEnoughCredits = mockUserCredits.credits >= price;
  
  const handleButtonPress = () => {
    // Implement logic for what happens when the button is pressed
    // For example, you can navigate to a payment screen or show a payment modal
    setIsPickerVisible(true);
  };

  //setIsPickerVisible(true)  
  return (
    <View style={styles.container}>
      <View style={styles.creditsContainer}>
        <Text style={styles.title}>Credits:</Text>
        <Text style={styles.credits}>{mockUserCredits.credits}€</Text>
      </View>
      <View>
        <Text style={styles.label}>{seats}x Person á {trip.price}€ </Text>

        <View style={styles.totalCredits}>
          <Text style={styles.labelCredits}>Total Amount: </Text>
          <Text style={[styles.labelCredits, {fontSize: 22, fontWeight: '200'}]}>{formattedPrice}€</Text>
        </View>

        {hasEnoughCredits ? (
          // this text below should be deleted. It was created for testing purposes
          <Text style={[styles.label, {color: '#39ba57'}]}>You have enough credits!</Text>
        ) : (
          // render +Add button if user does not have enough credits
          <TouchableOpacity onPress={handleButtonPress} style={styles.buttonContainer}>
            <Text style={[styles.label, {color: '#d91921', fontSize: 14, bottom: 6, paddingRight: 5}]}>You don't have enough credits! Add more</Text>
            <icons.Ionicons name='ios-add-circle' size={32} color='#d91921' />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default Bill;

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    // borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    bottom: 57,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,

  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',  
  },
  credits: {
    fontSize: 22,
    fontWeight: '200',
    bottom: 1,
  },
  label: {
    fontSize: 20,
    paddingTop: 10,
    fontStyle: 'italic'
  },
  labelCredits: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  totalCredits: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 80,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})