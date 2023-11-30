import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { useAuth } from '../../utils/auth';
import { RadioButton } from 'react-native-paper';

const addCredits: React.FC = () => {

    const { user } = useAuth();

    const [selectedMethod, setSelectedMethod] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [creditsAmount, setCreditsAmount] = useState('');

    const handleSubmitButton = async () => {
        setIsLoading(true); 

        // simulate an asynchronous operation (e.g., API call) here
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (selectedMethod && creditsAmount !== '' && Number(creditsAmount) > 0) {
            const currentCredits = parseFloat(user.credits.available);
            user.credits.available = (currentCredits + Number(creditsAmount)).toFixed(2);

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

         setTimeout(() => {
            setIsLoading(false);
            setSelectedMethod('');
            setCreditsAmount('');
        }, 2000);
    };

    const handleSelectAmount = (amount: string) => {
        setCreditsAmount((prevAmount) => {
            return prevAmount === amount ? '' : amount; 
        });
    };

  return (
    <ScrollView style={styles.container}>
        <View style={styles.creditsBalance}>
            <Text style={styles.title}>Credit Balance: </Text>
            <Text style={styles.creditsValue}>{user.credits.available}€</Text>
        </View>
        <Text style={[styles.subtitle, {paddingHorizontal: 15, marginBottom: 10}]}>Purchase additional credits using the various payment methods shown below.</Text>
       

       {/* CREDITS FORM */}
        <Text style={[styles.title, { paddingLeft: 15,}]}>Add Credits: </Text>
        <View style={styles.shadowContainer}>
            <TextInput 
                style={styles.creditsInput}
                placeholder="Add credits amount"
                keyboardType="numeric"
                value={creditsAmount}
                onChangeText={(text) => setCreditsAmount(text)}
            >
            </TextInput>
            <View style={[styles.container, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0,}]}>
                <TouchableOpacity style={styles.creditsButton}>
                    <Text 
                    style={styles.creditsButtonText}
                    onPress={() => handleSelectAmount('5')}
                    >
                        5€
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.creditsButton}>
                    <Text 
                    style={styles.creditsButtonText}
                    onPress={() => handleSelectAmount('10')}
                    >
                        10€
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.creditsButton}>
                    <Text 
                    style={styles.creditsButtonText}
                    onPress={() => handleSelectAmount('20')}
                    >
                        20€
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.creditsButton}>
                    <Text 
                    style={styles.creditsButtonText}
                    onPress={() => handleSelectAmount('50')}
                    >
                        50€
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
        
        {/* PAYMENT METHODS */}
        <Text style={[styles.title, {top: 10, paddingLeft: 15,}]}>Select Payment Method: </Text>
        <View style={styles.payContainer}>
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
                <View style={[styles.doubleImage, {paddingLeft: 6}]}>
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
                <View style={[styles.doubleImage, {paddingLeft: 6}]}>
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
            {isLoading ? (
                    <ActivityIndicator size='small' />
                ) : (
                    <Text style={styles.buttonText}>Submit</Text>
                )}
            </TouchableOpacity>

        </View>
    </ScrollView>
  )
}

export default addCredits

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    shadowContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 10, 
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        padding: 15,
        margin: 10,
        gap: 10,
    },
    payContainer: {
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
        paddingVertical: 15,
        paddingLeft: 20,
        paddingRight: 35,
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
        height: 60,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        paddingVertical: 10,
    },
    radiusButton: {
        backgroundColor: '#e0e0e0', //  backgroundColor: '#cad7df',
        height: 35,
        width: 35,
        borderRadius: 50,
    },
    creditsButton: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 50,
        width: 70,
        backgroundColor: '#8573c7',

    },
    creditsButtonText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        color: '#fff',
    },
    creditsInput: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#ededed',
        fontSize: 16,
    },
})
