import React, { useState } from 'react'
import { useAuth } from '../../utils/auth';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useFocusEffect, useNavigation } from 'expo-router';
import { Overlay } from '@rneui/themed';
import moment from 'moment';
import * as icons from '@expo/vector-icons';
import RatingStars from '../../components/RatingStars';
import ChangePasswordForm from '../../components/ChangePasswordForm';
import ImageUploader from '../../components/ImageUploader';
import COLORS from '../../COLORS';

const profile = () => {
    const { isAuthenticated, logout, user, token } = useAuth();
    const [visible, setVisible] = useState<boolean>(false);

    const { navigate } = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            if (!isAuthenticated) {
                navigate('login');
            }
        }, [isAuthenticated])
    );
    
    useFocusEffect(
        React.useCallback(() => {

        }, [token])
    );

    return (
        isAuthenticated && user && <ScrollView style={styles.scrollContainer}>

            {/* IMAGE UPLOADER - COMPONENT */}
            <ImageUploader />

            <View style={styles.container}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userStatus}>"Hola amig@s!"</Text>

                {/* CREDITS INFO */}
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.boarderBottomColor }}>
                        <Text style={styles.sectionTitle}>Current Credit Balance: </Text>
                        <Text style={[styles.sectionTitle, { paddingRight: 50, fontWeight: '400' }]}>{parseFloat(user.credits.available).toFixed(2)}€</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigate('addCredits')}>
                        <View style={[styles.sectionInfo, { paddingTop: 10 }]}>
                            <Text style={styles.sectionInfoText}>Add more credits</Text>
                            <icons.MaterialIcons name="arrow-forward-ios" size={18} color={COLORS.iconColor} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* TRAVEL EXPERIENCE */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Travel Experience</Text>
                    <View style={styles.sectionInfo}>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: 5, }}>
                            <Text style={[styles.sectionInfoText, { fontWeight: '600' }]}>As Driver</Text>
                            <Text style={styles.sectionInfoText}>{user.driverRating.totalReviews} Reviews</Text>
                            <RatingStars rating={Number(user.driverRating.totalReviews) === 0 ? 0 : Number(user.driverRating.totalRating/user.driverRating.totalReviews)} />
                        </View>
                    </View>
                </View>

                {/* ACCOUNT INFO */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Infomation</Text>

                    <View style={styles.sectionInfo}>
                        <View style={styles.sectionInfo}>
                            <icons.MaterialIcons name="phone" size={24} color={COLORS.iconColor} />
                            <Text style={[styles.sectionInfoText, { fontWeight: '600', paddingLeft: 10 }]}>Telephone: </Text>
                        </View>
                        <Text style={styles.sectionInfoText}>{user.phoneNumber}</Text>
                    </View>

                    <View style={styles.sectionInfo}>
                        <View style={styles.sectionInfo}>
                            <icons.MaterialIcons name="email" size={24} color={COLORS.iconColor} />
                            <Text style={[styles.sectionInfoText, { fontWeight: '600', paddingLeft: 10 }]}>Email: </Text>
                        </View>
                        <Text style={styles.sectionInfoText}>{user.email}</Text>
                    </View>

                    <View style={styles.sectionInfo}>
                        <View style={styles.sectionInfo}>
                            <icons.MaterialIcons name="card-membership" size={24} color={COLORS.iconColor} />
                            <Text style={[styles.sectionInfoText, { fontWeight: '600', paddingLeft: 10 }]}>Member since: </Text>
                        </View>
                        <Text style={styles.sectionInfoText}>{moment(parseInt(user.memberSince)).format('MMMM Do, YYYY')}</Text>
                    </View>

                </View>

                {/* PRIVACY */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy</Text>
                    <TouchableOpacity
                        onPress={() => { setVisible(!visible) }}
                    >
                        <View style={styles.sectionInfo}>
                            <Text style={styles.sectionInfoText}>Change password</Text>
                            <icons.MaterialIcons name="arrow-forward-ios" size={18} color={COLORS.iconColor} />
                        </View>
                    </TouchableOpacity>
                    <Overlay 
                    overlayStyle={styles.overlay}
                    isVisible={visible} 
                    onBackdropPress={() => { setVisible(!visible) }}>
                        <ChangePasswordForm setVisible={() => { setVisible(!visible) }} />
                    </Overlay>
                </View>
            </View>

            {/* LOGOUT */}
            <TouchableOpacity style={styles.button} onPress={() => { logout() }}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default profile;

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: COLORS.backgroundColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'space-between',
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
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    userStatus: {
        fontStyle: 'italic',
        fontSize: 16,
        padding: 5,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    section: {
        backgroundColor: COLORS.inputFields,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 15,
        borderColor: '#a8a8a8',
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        padding: 10,
        marginTop: 10,
    },
    sectionInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    sectionInfoText: {
        fontSize: 16,
    },
    overlay:{
        borderRadius: 15,
    },

});