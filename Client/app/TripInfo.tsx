import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text, View } from '../components/Themed';
import * as icons from '@expo/vector-icons';
import { Picker } from 'react-native-wheel-pick';

const mockDriver = {
  account: {
    name: 'Erik L.',
    member_since: '23rd, Feb. 2023'
  },
  trips: {
    amount: 31
  },
  rating: {
    total: 29,
    average: 4.9
  },
  car: {
    model: 'Audi A4',
    color: 'Black',
    seats: 4,
    license_plate: 'SO-SI-6969'
  },
  services: {
    smoking: false,
    child_seat: false,
    pets: false,
    alcohol: false,
    luggage: true,
    comment: 'I like driving under influence' //25 char max!
  }
}

const LocationInformation = ({ trip }) => {
  return (
    <View style={styles.locationContainer}>
      <View style={styles.timeContainer}>
        <View>
          <Text style={styles.time}>{trip.departure.time}</Text>
        </View>
        <View>
          <Text style={styles.totalTime}>{trip.trip.total_time}</Text>
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

const DriverInformation = ({ driver }) => {
  return (
    <View style={driver_style.container}>
      <View style={driver_style.information}>
        <View style={driver_style.profile}>
          <Text style={driver_style.name}>{driver.account.name}</Text>
          <Image
            source={require('../assets/images/driver.png')}
            style={{ height: 45, width: 45, borderRadius: 50 }}
          />
        </View>
      </View>
      <View style={driver_style.services}>
        <View style={driver_style.services_left}>
          <View style={driver_style.servicesItem}>
            <icons.MaterialCommunityIcons name='smoking' size={24} />
            <Text style={driver_style.services_text}>{mockDriver.services.smoking ? 'Allows smoking' : 'No smoking'}</Text>
          </View>
          <View style={driver_style.servicesItem}>
            <icons.MaterialCommunityIcons name='car-child-seat' size={24} />
            <Text style={driver_style.services_text}>{mockDriver.services.child_seat ? 'Has a child seat' : 'Has no child seat'}</Text>
          </View>
          <View style={driver_style.servicesItem}>
            <icons.MaterialIcons name='pets' size={24} />
            <Text style={driver_style.services_text}>{mockDriver.services.pets ? 'Allows pets' : 'No pets allowed'}</Text>
          </View>
        </View>
        <View style={driver_style.services_right}>
          <View style={driver_style.servicesItem}>
            <icons.FontAwesome5 name='wine-bottle' size={24} />
            <Text style={driver_style.services_text}>{mockDriver.services.alcohol ? 'Allows alcohol' : 'No alcohol allowed'}</Text>
          </View>
          <View style={driver_style.servicesItem}>
            <icons.MaterialIcons name='luggage' size={24} />
            <Text style={driver_style.services_text}>{mockDriver.services.luggage ? 'Allows luggage' : 'No luggage allowed'}</Text>
          </View>
          <View style={driver_style.servicesItem}>
            <icons.MaterialIcons name='comment' size={24} />
            <Text style={driver_style.services_text}>{mockDriver.services.comment}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const CarInformation = ({ driver }) => {
  return (
    <Text>Hi</Text>
  )
}

const Request = ({ trip }) => {
  const [price, setPrice] = useState(trip.price);
  return (
    <View style={request_styles.container}>
      <TouchableOpacity style={request_styles.buttonContainer}>
        <View style={request_styles.button}>
          <Text style={request_styles.buttonText}>{parseFloat(price).toFixed(2)}€</Text>
        </View>
      </TouchableOpacity>
      <Picker
        style={request_styles.picker}
        selectedValue='1'
        pickerData={['1', '2', '3', '4']}
        onValueChange={value => { setPrice(trip.price * value) }}
        itemStyle={request_styles.pickerItem}
      />
    </View>
  )
}

export default function ModalScreen() {
  const { trip } = useRoute().params;

  return (
    <View style={styles.container}>
      <FlatList
        data={[trip]}
        renderItem={({ item }) => (
          <>
            <LocationInformation trip={item} />
            <DriverInformation driver={mockDriver} />
            <CarInformation driver={mockDriver} />
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
    // borderWidth: 1.5,
    // borderColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    margin: 10
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    backgroundColor: '#000'
  },
  button: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  picker: {
    backgroundColor: '#fff',
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
    justifyContent: 'space-between',
    width: '95%',
    height: 200,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 15,
    padding: 10,
    margin: 10,
    marginTop: 10,
    marginBottom: 10
  },
  information: {
    width: '100%',
    height: 45
  },
  profile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 22,
    fontWeight: '600'
  },
  services: {
    flex: 1,
    flexDirection: 'row'
  },
  services_left: {
    width: '50%',
    gap: 20
  },
  services_right: {
    gap: 20,
    maxWidth: '85%'
  },
  servicesItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  services_text: {
    fontSize: 12,
    maxWidth: '50%'
  }
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
    borderWidth: 1.5,
    borderColor: '#000',
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
    fontWeight: '200',
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