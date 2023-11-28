import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useMockData } from '../utils/mockData';
import { RadioButton } from 'react-native-paper';

// TODO: Add setTimeout and a spinner for a better UX. Also, include some navigation
const addCredits: React.FC = () => {

    const { mockUsers } = useMockData();
    const [selectedMethod, setSelectedMethod] = useState('');

    const handleSubmitButton = () => {
        if (selectedMethod) {
            Alert.alert(
                'Yuuuhu!',
                'Your payment was sent through successfully. ',
            );
        } else {
            Alert.alert(
                'Error',
                'Unfortunately, there was an issue with processing your payment. Please try with a different method.',
            );
        }

        setSelectedMethod('');
    };

  return (
    <ScrollView style={styles.container}>
        <View style={styles.creditsBalance}>
            <Text style={styles.title}>Credit Balance: </Text>
            <Text style={styles.creditsValue}>{mockUsers[0].credits}€</Text>
        </View>
        <Text style={[styles.subtitle, {paddingHorizontal: 15}]}>Purchase additional credits using the various payment methods shown below.</Text>
        <Text style={[styles.title, { top: 10, paddingLeft: 15,}]}>Select Payment Method: </Text>

        <View style={styles.scrollViewContainer}>
            <View style={styles.payMethod}>
                <View style={styles.doubleImage}>
                    <Image style={styles.image} source={require('../../assets/images/VISA.png')}/>
                    <Image style={styles.image} source={require('../../assets/images/MASTERCARD.png')}/>
                </View>

                {/* <Text style={styles.title}>Card</Text> */}
                <View style={styles.radiusButton}>
                    <RadioButton 
                        value='Card'
                        status={ selectedMethod === 'Card' ? 'checked' : 'unchecked' }
                        onPress={() => setSelectedMethod('Card')}
                        uncheckedColor='#000'
                        color='#000' 
                    />
                </View>
                
            </View>
            <View style={styles.payMethod}>
                <View style={[styles.doubleImage, {width: 100}]}>
                    <Image style={styles.image} source={require('../../assets/images/PAYPAL.png')}/>
                </View>
                
                {/* <Text style={styles.title}>Paypal</Text> */}
                <View style={styles.radiusButton}>
                    <RadioButton 
                        value='Paypal'
                        status={ selectedMethod === 'Paypal' ? 'checked' : 'unchecked' }
                        onPress={() => setSelectedMethod('Paypal')}
                        color='#000' 
                    />
                </View>
                
            </View>
            <View style={styles.payMethod}>
                <View style={styles.doubleImage}>
                    <Image style={styles.image} source={require('../../assets/images/KLARNA.png')}/>
                </View>
                
                {/* <Text style={styles.title}>Klarna</Text> */}
                <View style={styles.radiusButton}>
                    <RadioButton 
                        value='Klarna'
                        status={ selectedMethod === 'Klarna' ? 'checked' : 'unchecked' }
                        onPress={() => setSelectedMethod('Klarna')}
                        color='#000' 
                    />
                </View>
                
            </View>
            <View style={styles.payMethod}>
                <View style={styles.doubleImage}>
                    <Image style={styles.image} source={require('../../assets/images/GOOGLEPAY.png')}/>
                </View>
                
                {/* <Text style={styles.title}>Google Pay</Text> */}
                <View style={styles.radiusButton}>
                    <RadioButton 
                        value='Google Pay'
                        status={ selectedMethod === 'Google Pay' ? 'checked' : 'unchecked' }
                        onPress={() => setSelectedMethod('Google Pay')}
                        color='#000' 
                    />
                </View>
                
            </View>
            <View style={styles.payMethod}>
                <View style={styles.doubleImage}>
                    <Image style={styles.image} source={require('../../assets/images/APPLEPAY.png')}/>
                </View>
                
                {/* <Text style={styles.title}>Apple Pay</Text> */}
                <View style={styles.radiusButton}>
                    <RadioButton 
                        value='Apple Pay'
                        status={ selectedMethod === 'Apple Pay' ? 'checked' : 'unchecked' }
                        onPress={() => setSelectedMethod('Apple Pay')}
                        color='#000' 
                    />
                </View>
                
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmitButton}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
  )
}

export default addCredits

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    scrollViewContainer: {
        paddingHorizontal: 10,
    },
    creditsBalance: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        borderRadius: 10,
        paddingVertical: 15,
        margin: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    creditsValue: {
        fontSize: 22,
        fontWeight: '300',
        paddingLeft: 5,
    },
    subtitle: {
        fontSize: 16,
        paddingVertical: 10,
        textAlign: 'center',
    },
    payMethod: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10, 
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        padding: 15,
        top: 10,
        marginTop: 15,

    },
    image: {
        width:80,
        height: 50,
        alignSelf: 'flex-start',
        resizeMode: 'contain',
        padding: 0,
    },
    doubleImage: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        top: 30, 
        backgroundColor: '#000',
        borderRadius: 50,
        marginBottom: 90,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        paddingVertical: 20,
    },
    radiusButton: {
        // borderWidth: 2,
        // borderColor: '#000',
        backgroundColor: '#cad7df',
        height: 35,
        width: 35,
        borderRadius: 50,
        // padding: 20,

    },
})
