import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text, View } from '../components/Themed';

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
    comment: 'I listen to Heavy Metal on max volume'
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
            <View style={styles.horizontalLine}></View>
            <DriverInformation driver={mockDriver} />
          </>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={{ width: '100%' }}
      />
    </View>
  );
}

const driver_style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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
    marginBottom: 25
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
  }
});

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 25
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