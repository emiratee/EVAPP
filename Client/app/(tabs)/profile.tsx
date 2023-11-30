import React, { useState } from 'react'
import { useAuth } from '../../utils/auth';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useFocusEffect, useNavigation } from 'expo-router';
import { Overlay } from '@rneui/themed';
import moment from 'moment';
import * as icons from '@expo/vector-icons';
import RatingStars  from '../../components/RatingStars';
import ChangePasswordForm from '../../components/ChangePasswordForm';


type Props = {}


const profile = (props: Props) => {
  const [visible, setVisible] = useState(false);

  const { isAuthenticated, logout, user } = useAuth();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      if (!isAuthenticated) {
        navigation.navigate('login');
      }
    }, [isAuthenticated])
  );

  const handleSubmit = ()=>{
    logout();
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.picture}>
        <Text style={{alignSelf: 'center'}}>Avatar/Photo</Text>
      </View>
      <View style={styles.container}>
        <Text style={[styles.userName, {textAlign: 'center'}]}>{user.name}</Text>
        <Text style={[styles.userStatus, {textAlign: 'center', marginBottom: 10}]}>Hola amig@s!</Text>

        {/* TRAVEL EXPERIENCE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Experience</Text>
          <View style={styles.sectionInfo}>
            <View style={{flexDirection: 'column', justifyContent:'center', alignItems: 'center'}}>
              <Text style={[styles.sectionInfoText, {fontWeight: '600'}]}>As Passenger</Text>
              <Text style={styles.sectionInfoText}>{parseFloat(user.passengerRating.totalReviews)} Reviews</Text>
              <RatingStars rating={parseFloat(user.passengerRating.averageRating)}/>
            </View>

            <View style={{flexDirection: 'column', justifyContent:'center', alignItems: 'center'}}>
              <Text style={[styles.sectionInfoText, {fontWeight: '600'}]}>As Driver</Text>
              <Text style={styles.sectionInfoText}>{parseFloat(user.driverRating.totalReviews)} Reviews</Text>
              <RatingStars rating={parseFloat(user.driverRating.averageRating)}/>
            </View>
          </View>
        </View>

        {/* ACCOUNT INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Infomation</Text>

          <View style={styles.sectionInfo}>
            <View style={styles.sectionInfo}>
              <icons.MaterialIcons name="phone" size={24} color="black" />
              <Text style={[styles.sectionInfoText, {fontWeight: '600', paddingLeft: 10}]}>Telephone: </Text>
            </View>
            <Text style={styles.sectionInfoText}>{user.phoneNumber}</Text>
          </View>

          <View style={styles.sectionInfo}>
            <View style={styles.sectionInfo}>
              <icons.MaterialIcons name="email" size={24} color="black" />
              <Text style={[styles.sectionInfoText, {fontWeight: '600', paddingLeft: 10}]}>Email: </Text>
            </View>
            <Text style={styles.sectionInfoText}>{user.email}</Text>
          </View>

          <View style={styles.sectionInfo}>
          <View style={styles.sectionInfo}>
              <icons.MaterialIcons name="card-membership" size={24} color="black" />
              <Text style={[styles.sectionInfoText, {fontWeight: '600', paddingLeft: 10}]}>Member since: </Text>
            </View>
            <Text style={styles.sectionInfoText}>{moment(parseInt(user.memberSince)).format('MMMM Do, YYYY')}</Text>
          </View>
          
        </View>

        {/* PRIVACY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <TouchableOpacity
          onPress={toggleOverlay}
          >
            <View style={styles.sectionInfo}>
                <Text style={styles.sectionInfoText}>Change password</Text>
                <icons.MaterialIcons name="arrow-forward-ios" size={18} color="black"/>
            </View>
          </TouchableOpacity>
          <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <ChangePasswordForm/>
          </Overlay>
        </View>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default profile;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  picture: {
    height: 120,
    width: 120,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 80,
    marginVertical: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent:'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userStatus: {
    fontStyle: 'italic'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    padding: 10,
    marginTop: 10,
  },
  sectionInfo:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  sectionInfoText: {
    fontSize: 16,
  }

})