import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as icons from '@expo/vector-icons';

const Bill: React.FC = ({ trip, price, seats, setIsPickerVisible, hasEnoughCredits, mockUser }) => {
  const navigate = useNavigation();
  const handleButtonPress = () => {
    setIsPickerVisible(true);

    navigate.navigate('addCredits') 
  }
 
  return (
    <View style={styles.container}>
      <View style={styles.creditsContainer}>
        <Text style={styles.title}>Credits:</Text>
        <Text style={styles.credits}>{mockUser.credits}€</Text>
      </View>

      <View>
        <Text style={[styles.label, { paddingLeft: 5 }]}>{seats}x {seats === 1 ? 'seat' : 'seats'} á {parseFloat(trip.price).toFixed(2)}€</Text>

        <View style={styles.totalCredits}>
          <View style={styles.totalContainer}>
            <Text style={styles.labelCredits}>Total Amount: </Text>
            <Text style={[styles.labelCredits, { fontSize: 20, fontWeight: '300' }]}>{parseFloat(price).toFixed(2)}€</Text>
          </View>
          <View style={styles.totalContainer}>
            <icons.Ionicons name="ios-information-circle-sharp" size={10} color="black" />
            <Text style={styles.hint}>Seats are booked when the driver accepts the request</Text>
          </View>
        </View>

        {!hasEnoughCredits ? (
          <TouchableOpacity onPress={handleButtonPress} style={[styles.buttonContainer, { top: 10 }]}>
            <Text style={[styles.label, { color: '#d91921', fontSize: 14, bottom: 6, paddingRight: 5 }]}>It seems you don't have enough credits.</Text>
            <Text style={[styles.label, { color: '#d91921', fontSize: 14, bottom: 6, paddingRight: 5, fontWeight: 'bold' }]}>Add more here.</Text>
          </TouchableOpacity>
        ) : (
          <Text></Text>
        )}

      </View>
    </View>
  )
}

export default Bill;

const styles = StyleSheet.create({
  container: {
    height: 265,
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#000',
    borderRadius: 10,
    position: 'absolute',
    bottom: -5,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex: -1
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  credits: {
    fontSize: 18,
    fontWeight: '200',
  },
  label: {
    fontSize: 18,
    paddingTop: 10,
  },
  labelCredits: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  totalCredits: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    top: 80,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  totalContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hint: {
    fontSize: 10
  }
})
