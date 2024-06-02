import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity } from 'react-native' //import react native components
import React, { useState } from 'react' //import react

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context' //import react native SafeAreaProvider and SafeAreaView
import { useTheme } from '../contexts/ThemeProvider' //import theme context
import { useControl } from '../contexts/ControlProvider' //import control context
import { firestore, auth } from '../database/config' //import database config
import { signInWithEmailAndPassword } from 'firebase/auth' //import firebase auth
import { getDocs, collection, where, query, doc, getDoc } from 'firebase/firestore' //import firebase firestore
import AsyncStorage from '@react-native-async-storage/async-storage' //import async storage from react native

export default function AuthenticationScreen({navigation}) {

  const { colors, fonts } = useTheme() //importin colors and fonts from themeProvider
  const { userAsyncData, setUserAsyncData } = useControl() //importing userAsyncData and setUserAsyncData from controlProvider
  const styles = createStyles(colors, fonts) //create styles function and insert fonts and colors
  const [email, setEmail] = useState("") //create state for email
  const [password, setPassword] = useState("") //create state for password
  const [identifier, setIdentifier] = useState("Login") //create state for identifier login or register
  const [errorMessage, setErrorMessage] = useState("") //create state for error messages

  const userAction = () => {
    const patterns = [/^[a-zA-Z0-9._%+-]+@gmail\.com$/,/^[a-zA-Z0-9._%+-]+@yahoo\.com$/] //valid email patterns
    if( email && password){ //identify if email and password are not empty
      if( patterns[0].test(email) || patterns[1].test(email) ){ //check if email is valid based on the provided patterns
        identifier == "Login" ? login() : register() //identify if identifier is login or register
        setErrorMessage("") //clear error message
      } else { setErrorMessage("Invalid Email Address") } //if email is not valid, display error message
    } else { setErrorMessage("Please fill in all fields") } //if email and password are empty, display error message
  }

  const ErrorMessageHandler = (errorCode) => {
    const errorMessage = errorCode.replace("auth/", "").replace("-", " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") //edit error code message
    setErrorMessage(errorMessage); //set error message
  }
  //login and register handler
  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password) //login user with email and password
      if (!user.user.uid) { //if user does not exist in firebase/auth
        throw new Error('Could not login user'); //throw error message
      }
      const collectionsToSearch = [["client"],["rider"]]; //list of collections to search
      for (const path of collectionsToSearch) { //loop through collections
        const querySnapshot = await getDocs(collection(firestore, ...path)); //create query
        const userDoc = querySnapshot.docs.find(doc => doc.data().uid === user.user.uid); //find document
        console.log(userDoc);
        if (userDoc) {  //if document exists
          await AsyncStorage.setItem('userData', JSON.stringify({...userAsyncData, userInformation: userDoc.data(), isLoggedIn: true}));
          setUserAsyncData({...userAsyncData, userInformation: userDoc.data(), isLoggedIn: true}) //set userAsyncData
        } else if (!userDoc) { console.log('No such document!'); } //if document does not exist
      }
    } catch (error) {
      error.code == undefined ? null : ErrorMessageHandler(error.code)
    }
  }
  

  const register = async () => {
    try {
      const loweredEmail = email.toLowerCase() //lowercase email
      const clientQuery = query(collection(firestore, "client"), where("email", "==", loweredEmail)) //create query
      const riderQuery = query(collection(firestore, "rider"), where("email", "==", loweredEmail)) //create query
      const clientSnapshot = await getDocs(clientQuery) //get client query
      const riderSnapshot = await getDocs(riderQuery) //get rider query
      if (clientSnapshot.size > 0 || riderSnapshot.size > 0) { //if email already exists
        setErrorMessage("Email already exists") //display error message
      } else { //if email does not exist
        setUserAsyncData({...userAsyncData, userInformation:{email: loweredEmail, password: password}}) //set userAsyncData email and password
        await navigation.navigate("Registration") //navigate to registration screen
      }
    } catch (error) { //catch error
      ErrorMessageHandler(error.code) //display error message in errormessagehandler
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ImageBackground style={styles.bgContainer} source={require("../assets/images/BG-GW.png")}>
          <View style={styles.formContainer}>
            <View style={styles.brandTextContainer}>
              <Text style={styles.brand}>GO</Text>
              <Text style={styles.brand2}>WITH</Text>
            </View>
            <View style = {styles.inputContainer}> 
              <TextInput style={styles.textInputContainer} onChangeText={(Text) => setEmail(Text)} placeholder="Email"/>
              <TextInput style={styles.textInputContainer} onChangeText={(Text) => setPassword(Text)} placeholder="Password" secureTextEntry={true}/>
            </View>
            <View style = {styles.buttonContainer}>
              <Text style = {styles.errorMessage}>{errorMessage}</Text>
              <TouchableOpacity style = {styles.actionButton} onPress={() => userAction()}>
                <Text style={styles.textButton}>{identifier == "Login" ? "Login" : "Register"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.changeActionButton} onPress={() => {setIdentifier(identifier == "Login" ? "Signup" : "Login");}}>
                <Text style={styles.changeActionText}>{identifier == "Login" ? "Dont have an account? Signup" : "Already have an account? Login"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const createStyles = (colors, fonts) => StyleSheet.create({
  bgContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
  },
  brandTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  brand: {
    fontSize: 60,
    fontFamily: fonts.RR,
    color: colors.secondary,
  },
  brand2: {
    fontSize: 60,  
    fontFamily: fonts.RR,
    color: colors.primary,
  },
  formContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  inputContainer: {
    width: "80%",
    justifyContent: "center",
  },
  textInputContainer: {
    height: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 50,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10
  },
  buttonContainer: {
    width: "100%",
    height: 'fit-content',
    justifyContent: "center",
    alignItems: "center",   
  },
  errorMessage: {
    color: colors.error,
    fontSize: 15,
    fontFamily: fonts.RR
  },
  actionButton: {
    width: "80%",
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 50,
    marginBottom: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  textButton: {
    color: "white",
    fontSize: 15,
    fontFamily: fonts.RR
  },
  changeActionButton: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center"
  },
  changeActionText: {
    color: "#371287",
    fontSize: 15,
    fontFamily: fonts.RR,
  },
});