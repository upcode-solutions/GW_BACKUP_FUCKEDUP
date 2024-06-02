import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native' //import basic react components
import React, { useState } from 'react' //import basic react and usestate

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context' //import for SafeAreaProvider and SafeAreaView
import { useControl } from '../contexts/ControlProvider' //import control context
import { useTheme } from '../contexts/ThemeProvider' //import theme context
import Ionicos from 'react-native-vector-icons/Ionicons' //import vector icons
import { set } from 'firebase/database'

export default function RegistrationScreen({navigation}) {

    const { userAsyncData, setUserAsyncData } = useControl() //import useAsyncData from control context
    const { colors, fonts } = useTheme() //import colors and fonts from theme context
    const styles = createStyles(colors, fonts) //insert colors and fonts to styles

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [EmcContactName, setEmcContactName] = useState('')
    const [EmcContactNumber, setEmcContactNumber] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isRider, setIsRider] = useState(false)
    let userType = isRider ? 'rider' : 'client'

    const cancel = () => {
        navigation.goBack()
    }

    const register = async() => {
        if (firstName === '' || lastName === '' || username === '' || contactNumber === '' || EmcContactName === '' || EmcContactNumber === '') {
            setErrorMessage('Please fill in all fields')
        } else {
            await setUserAsyncData({...userAsyncData, onVerify: true, userInformation: { ...userAsyncData.userInformation, 
                firstName: firstName, 
                lastName: lastName, 
                username: username, 
                contactNumber: contactNumber, 
                EmcContactName: EmcContactName, 
                EmcContactNumber: EmcContactNumber, 
                userType: userType, 
                userStatus: 'pending' }});
        }
    }

    console.log(userType);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground style={styles.bgContainer} source={require('../assets/images/BG-GW.png')}>
            <TouchableOpacity onPress={() => setIsRider(!isRider)}>
                { isRider ? <Ionicos name='radio-button-on-outline'/> : <Ionicos name='radio-button-off-outline'/> }
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
                <View style={styles.welcomeTagContainer}>
                    <Text style={styles.text}>WELCOME TO</Text>
                    <View style={styles.brandTextContainer}>
                    <Text style={styles.lettering1}>THE </Text>
                    <Text style={styles.brand}>GO</Text>
                    <Text style={styles.brand2}>WITH</Text>
                    <Text style={styles.lettering1}> FAMILY</Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.nameContainer}>
                        <TextInput style={styles.nameInputContainer} onChangeText={(text) => setFirstName(text)} placeholder='First Name'/>
                        <TextInput style={styles.nameInputContainer} onChangeText={(text) => setLastName(text)} placeholder='Last Name'></TextInput>
                    </View>
                    <TextInput style={styles.textInputContainer} onChangeText={(text) => setUsername(text)} placeholder='Username' />
                    <TextInput style={styles.textInputContainer} onChangeText={(text) => setContactNumber(text)} placeholder='Contact No.' keyboardType='number-pad' maxLength={11} />
                    <TextInput style={styles.textInputContainer} onChangeText={(text) => setEmcContactName(text)} placeholder='Emergency Contact Name' />
                    <TextInput style={styles.textInputContainer} onChangeText={(text) => setEmcContactNumber(text)} placeholder='Emergency Contact No.' keyboardType='number-pad' max maxLength={11}/>
                    <Text style={styles.errorMessage}>{ errorMessage }</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button1} onPress={() => cancel()}>
                        <Text style={styles.buttonText}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => register()}>
                        <Text style={styles.buttonText}>CONTINUE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const createStyles = (colors, fonts) => StyleSheet.create({
    container: {
        flex: 1,
    },
    bgContainer: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    SwitchContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 50,
        height: 50
    },
    welcomeTagContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    text: {
        fontFamily: fonts.RR,
        fontSize: 35,
        color: colors.secondary
    },
    brandTextContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    brand: {
        fontFamily: fonts.RR,
        fontSize: 25,
        color: colors.secondary,
    },
    brand2: {
        fontFamily: fonts.RR,
        fontSize: 25,
        color: colors.primary,
    },
    lettering1: {
        fontFamily: fonts.RR,
        fontSize: 25,
        color: colors.tertiary
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorMessage: {
        color: colors.error,
        fontSize: 15,
        fontFamily: fonts.RR,
    },
    nameContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    SwitchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameInputContainer: {
        backgroundColor: colors.background,
        width: '49%',
        height: 50,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10
    },
    textInputContainer: {
        backgroundColor: colors.background,
        width: '90%',
        height: 50,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.secondary,
        paddingHorizontal: 20,
        marginBottom: 10
      },
    buttonContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    button: {
        backgroundColor: '#341484',
        width: '49%',
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button1: {
        backgroundColor: '#c595fa',
        width: '49%',
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Rubik-SemiBold',
        fontSize: 18
    }
})