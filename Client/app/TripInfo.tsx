import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text, View } from '../components/Themed';

const LocationInformation = ({ trip }) => {
  return (
    <View style={styles.container}>

      <View style={styles.locationContainer}>
        <View style={styles.departureContainer}>
          <View style={styles.departureTime}>
            <Text style={styles.time}>{trip.departure.time}</Text>
          </View>
          <View style={styles.dot}></View>
          <View>
            <Text style={styles.address}>{trip.departure.address}</Text>
            <Text style={styles.city}>{trip.departure.city}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default function ModalScreen() {
  const { trip } = useRoute().params;

  return (
    <FlatList
      data={[trip]}
      renderItem={({ item }) => (
        <LocationInformation trip={item} />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  locationContainer: {
    flex: 1,
    width: '95%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 15,
    alignItems: 'flex-start',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  departureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
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
    height: 100,
    top: 10,
    bottom: 0,
    left: 3,
  },
});
