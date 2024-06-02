import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'

import { useTheme } from '../contexts/ThemeProvider' //import theme context provider
import { useControl } from '../contexts/ControlProvider' //import  userAsyncData context control provider
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context' //import SafeAreaProvider and SafeAreaView
import AysncStorage from '@react-native-async-storage/async-storage'; //import AsyncStorage

export default function WelcomeScreen({navigation}) {

    const { colors, fonts } = useTheme(); //get themes from themeProvider context
    const { userAsyncData, setUserAsyncData } = useControl(); //get userAsyncData from controlProvider context

    const styles = createStyles(colors, fonts); //styles and inseting fonts and colors to a function

    const changeStateHandler = async () => { //change handler for asyncStorage, and state of isNewUser
      await AysncStorage.setItem('userData', JSON.stringify({...JSON.parse(await AysncStorage.getItem('userData')), isNewUser: false}));
      await setUserAsyncData({...userAsyncData, isNewUser: false});
      console.log("isNewUser changed to false");
      navigation.navigate('Authentication');
    }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground style={styles.bgimage} source={require('../assets/images/BG-GW.png')}>
          <View>
            <View style={styles.brandTextContainer}>
                <Text style={styles.brand}>GO</Text>
                <Text style={styles.brand2}>WITH</Text>
            </View>
            <View style={styles.wholeButtonContainer}>
                <TouchableOpacity style={styles.startButtonCon} onPress={() => changeStateHandler()}>
                    <Text style={styles.startButton}>GET STARTED</Text>
                </TouchableOpacity> 
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const createStyles = (colors, fonts) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    bgimage: {
        flex: 1,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        justifyContent: "center",
        alignItems: "center",
    },
    brandTextContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      },
      brand: {
        fontFamily: fonts.RR,
        fontSize: 55,
        color: colors.primary,
    },
    brand2: {
        fontFamily: fonts.RR,
        fontSize: 55,
        color: colors.secondary,
    },
    wholeButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
        minWidth: '100%',
        marginTop: 10,
    },
    startButtonCon: {
        backgroundColor: colors.primary,
        width: '80%',
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    startButton: {
        fontFamily: fonts.RubikSemiBold,
        fontSize: 15,
        color: colors.background,
    },
})
    