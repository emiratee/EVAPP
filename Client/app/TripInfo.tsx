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
    total: 31
  },
  rating: {
    total: 29,
    average: 4.9
  },
  car: {
    model: 'Audi A4',
    color: 'Black',
    seats: 4,
    number_plate: 'SO-SI-6969'
  },
  services: {
    smoking: false,
    child_seat: false,
    pets: false,
    alcohol: false,
    luggage: true,
    comment: 'Fix me!!!' //Fix sizing
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

const DriverInformation = ({ trip, driver }) => {
  return (
    <View style={driver_style.container}>
      <View style={driver_style.header}>
        <View style={driver_style.profile}>
          <View>
            <Text style={driver_style.profileName}>{driver.account.name}</Text>
          </View>
          <View style={driver_style.profileInformation}>
            <View style={driver_style.rating}>
              <Text style={driver_style.ratingText}>{`${driver.rating.total}/${driver.trips.total} reviews • ${driver.rating.average}`}</Text>
              <icons.AntDesign name='star' size={12} />
            </View>
            <Image
              source={require('../assets/images/driver.png')}
              style={{ height: 40, width: 40, borderRadius: 50 }}
            />
          </View>
        </View>
      </View>


      <View style={driver_style.carContainer}>
        <Text style={driver_style.carName}>{driver.car.model}</Text>
        <View style={driver_style.carInformation}>
            <View style={driver_style.carInformationItem}>
              <Text style={driver_style.carInformationItemText}>Color:</Text>
              <Text style={driver_style.carInformationItemValue}>{driver.car.color}</Text>
            </View>
            <View style={driver_style.carInformationItem}>
              <Text style={driver_style.carInformationItemText}>Seats:</Text>
              <Text style={driver_style.carInformationItemValue}>{driver.car.seats}</Text>
            </View>
        </View>
        <View style={driver_style.carInformation}>
            <View style={driver_style.carInformationItem}>
              <Text style={driver_style.carInformationItemText}>Number plate:</Text>
              <Text style={driver_style.carInformationItemValue}>{driver.car.number_plate}</Text>
            </View>
            <View style={driver_style.carInformationItem}>
              <Text style={driver_style.carInformationItemText}>Seats available:</Text>
              <Text style={driver_style.carInformationItemValue}>{trip.seats.available}</Text>
            </View>
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
            <Text style={driver_style.services_text}>{mockDriver.services.child_seat ? 'Has a child seat' : 'No child seat'}</Text>
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

const CarInformation = ({ trip, driver }) => {
  return (
    <View style={car_styles.container}>
      <View style={car_styles.header}>
        <View style={car_styles.carModel}>
          <Text style={car_styles.carName}>{driver.car.model}</Text>
          <Text style={car_styles.carColor}>{`(${driver.car.color})`}</Text>
        </View>
        <View style={car_styles.carSeats}>
          <icons.MaterialCommunityIcons name="seat-passenger" size={18} color="black" />
          <Text>{`${trip.seats.available}/${trip.seats.total} seats available`}</Text>
        </View>
      </View>
      <View style={car_styles.information}>
        <View>

        </View>
      </View>
    </View>
  )
}

const Request = ({ trip }) => {
  const [price, setPrice] = useState(trip.price);
  const handlePriceChange = (value: string) => {
    const number: number = parseFloat(value);
    const price: number = parseFloat((trip.price * number).toFixed(2));
    setPrice(price.toString());
  }

  const createPickerDataArray = () => {
    return Array.from({ length: trip.seats.total }, (_, index) => index < trip.seats.available ? (index + 1).toString() : '').slice(0, trip.seats.available);
  }

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
        pickerData={createPickerDataArray()}
        onValueChange={(value: string) => { handlePriceChange(value) }}
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
            <DriverInformation trip={trip} driver={mockDriver} />
            <CarInformation trip={trip} driver={mockDriver} />
          </>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={{ width: '100%', height: '100%' }}
      />
      <Request trip={trip} />
    </View>
  );
}

const car_styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '95%',
    height: 200,
    position: 'relative',
    borderColor: '#a8a8a8',
    borderRadius: 15,
    padding: 10,
    margin: 10,
    marginTop: 10,
    marginBottom: 10
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  carModel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5
  },
  carName: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  carColor: {
    fontSize: 15,
    fontWeight: '600'
  },
  carSeats: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  information: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  }
})

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
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
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
    height: 450,
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
    padding: 10
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
  services: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  services_left: {
    gap: 20,
    maxWidth: '60%'
  },
  services_right: {
    gap: 20,
    maxWidth: '60%'
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