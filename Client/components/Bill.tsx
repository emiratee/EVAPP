import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../utils/auth';


const Bill: React.FC = ({ trip, price, seats, setIsPickerVisible, hasEnoughCredits }) => {
  const { user } = useAuth();
  const formattedPrice = parseFloat(price).toFixed(2);
  const navigate = useNavigation();
  
  const handleButtonPress = () => {
    setIsPickerVisible(true);

    navigate.navigate('addCredits') 
  }
 
  return (
    <View style={styles.container}>
      <View style={styles.creditsContainer}>
        <Text style={styles.title}>Credits:</Text>
        <Text style={styles.credits}>{user.credits.available}€</Text> 
      </View>

      <View>
        <Text style={styles.label}>{seats}x Person á {trip.price}€ </Text>

        <View style={styles.totalCredits}>
          <Text style={styles.labelCredits}>Total Amount: </Text>
          <Text style={[styles.labelCredits, {fontSize: 22, fontWeight: '200'}]}>{formattedPrice}€</Text>
        </View>

        {!hasEnoughCredits ? (
            <TouchableOpacity onPress={handleButtonPress} style={[styles.buttonContainer, { top: 10 }]}>
              <Text style={[styles.label, {color: '#d91921', fontSize: 14, bottom: 6, paddingRight: 5}]}>It seems you don't have enough credits.</Text>
              <Text style={[styles.label, {color: '#d91921', fontSize: 14, bottom: 6, paddingRight: 5, fontWeight: 'bold'}]}>Add more here.</Text>
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
    shadowOffset: { width: 1, height: 0 },
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
