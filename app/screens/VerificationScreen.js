import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native' //import basic react native components
import React, { useState } from 'react' //import react usestate

import { useTheme } from '../contexts/ThemeProvider' //import theme context
import { useControl } from '../contexts/ControlProvider' //import control context
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context' //import safearea components
import { db, auth, storage, firestore } from '../database/config' //import firebase config
import { createUserWithEmailAndPassword } from "firebase/auth"
import { ref, uploadBytes } from "firebase/storage"
import { doc, setDoc, collection } from "firebase/firestore"

import * as ImagePicker from 'expo-image-picker' //import image picker
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage' //import async storage

export default function VerificationScreen({navigation}) {

  const { colors, fonts } = useTheme()
  const { userAsyncData, setUserAsyncData } = useControl()
  const styles = createStyles(colors, fonts)

  const [ profileImage, setProfileImage ] = useState(null)
  const [ idImageFront, setIdImageFront ] = useState(null)
  const [ idImageBack, setIdImageBack ] = useState(null)
  const [ isChecked, setIsChecked ] = useState(false)
  const [ errorMessage, setErrorMessage ] = useState(null)

  const pickImage = async (location, ratio) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: ratio,
      quality: 1,

    });
    if (!result.canceled) {
      location(result.assets[0].uri)
    }
  }

  const imageUploadHandler = async (name, location, type) => {
    const imageName = `${name}-${type}.jpg`;
    const response = await fetch(location);
    const blob = await response.blob();
    const storageRef = ref(storage, `users/${userAsyncData.userInformation.userType}/${name}/${imageName}`);

    try {
      const snapshot = await uploadBytes(storageRef, blob);
      console.log("successfully uploaded: ",snapshot.metadata.name);
    }
    catch (error) {
        console.log(error);
    }
  }

  const createFirestoreData = async (name) => {
    try {
      await setDoc(doc(collection(firestore, `${userAsyncData.userInformation.userType}`),`${name}` ), {
        uid: name,
        firstName: userAsyncData.userInformation.firstName,
        lastName: userAsyncData.userInformation.lastName,
        username: userAsyncData.userInformation.username,
        contactNumber: userAsyncData.userInformation.contactNumber,
        emergencyContacName: userAsyncData.userInformation.EmcContactName,
        emergencyContactNumber: userAsyncData.userInformation.EmcContactNumber,
        email: userAsyncData.userInformation.email,
        userType: userAsyncData.userInformation.userType,
        userStatus: userAsyncData.userInformation.userStatus,
      });
      await AsyncStorage.setItem('userData', JSON.stringify({ ...userAsyncData, isLoggedIn: true, onVerify: false, userInformation: { ...userAsyncData.userInformation, uid: name } }));
      await setUserAsyncData({ ...userAsyncData, isLoggedIn: true, onVerify: false, userInformation: { ...userAsyncData.userInformation, uid: name } });
    } catch (error) {
      console.log(error);
    }
  }

  const submit = async () => {
    if (profileImage && idImageFront && idImageBack) {
      if (isChecked) {
        try {
          const createUser = await createUserWithEmailAndPassword(auth, userAsyncData.userInformation.email, userAsyncData.userInformation.password);
          if (!createUser.user.uid) {
            throw new Error('Could not create user');
          }
          console.log("user created: ", createUser.user.uid);
          await imageUploadHandler(createUser.user.uid, profileImage, "profile");
          await imageUploadHandler(createUser.user.uid, idImageFront, "idFront");
          await imageUploadHandler(createUser.user.uid, idImageBack, "idBack");
          await createFirestoreData(createUser.user.uid);
        } catch (error) {
          if(error.code === 'auth/weak-password') {
            Alert.alert('Error', 'Password should be at least 6 characters, please try again');
            setUserAsyncData({ ...userAsyncData, onVerify: false, userInformation: {}});
          }
        }
      } else { setErrorMessage("Please agree to the terms and conditions"); }
    } else { setErrorMessage("Please fill all the fields"); }
  }
  

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground style={styles.bgContainer} source={require('../assets/images/BG-GW.png')}>
          <View style={styles.formContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText1}>Upload a Profile Picture</Text>
              <Text style={styles.headerText2}>Please make sure that it clearly shows your face.</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => pickImage(setProfileImage, [1, 1])}>
              { profileImage ? <Image source={{ uri: profileImage }} style={styles.buttonDsiplay} /> : <View style={styles.buttonDsiplay}><Ionicons name="person" size={50} color={colors.primary}/><Text style={styles.subformText}> Choose Profile </Text></View> }
            </TouchableOpacity>
            <View style={styles.subformContainer}>
              <TouchableOpacity style={styles.subformButton} onPress={() => pickImage(setIdImageFront, [4, 3])}>
                { idImageFront ? <View style={styles.subformDsiplay}><Text style={styles.subformText}>{userAsyncData.userInformation.username} Front valid ID</Text><Ionicons name="image" size={24} color={colors.primary}/></View> : <Text style={styles.subformDsiplay}>Choose valid ID - Front</Text> }
              </TouchableOpacity>
              <TouchableOpacity style={styles.subformButton} onPress={() => pickImage(setIdImageBack, [4, 3])}>
                { idImageBack ? <View style={styles.subformDsiplay}><Text style={styles.subformText}>{userAsyncData.userInformation.username} Back valid ID</Text><Ionicons name="image" size={24} color={colors.primary}/></View> : <Text style={styles.subformDsiplay}>Choose valid ID - Back</Text> }
              </TouchableOpacity>
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity style={styles.checkbox} onPress={() => setIsChecked(!isChecked)}>
                {isChecked ? <Ionicons name="checkmark-circle" size={30} color={colors.primary}/> : <Ionicons name="checkmark-circle-outline" size={30} color={colors.primary}/> }
              </TouchableOpacity>
              <Text>I agree to the terms and conditions</Text>
            </View>
            <Text style={[styles.errorMessage, { height: errorMessage ? 20 : 0 }]}>{errorMessage}</Text>
            <TouchableOpacity style={styles.submitButton} onPress={() => submit()}>
              <Text style={styles.submitButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const createStyles = (colors, fonts) => StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bgContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText1: {
    fontSize: 20,
    fontFamily: fonts.RR,
    color: colors.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  headerText2: {
    fontSize: 15,
    fontFamily: fonts.RR,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  formContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    letterSpacing: -0.5,
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDsiplay: {
    width: 200, 
    height: 200, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100, 
    borderColor: colors.primary, 
    borderWidth: 2,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 15,
    fontFamily: fonts.RR,
    color: colors.primary
  },
  subformContainer: {
    width: '100%',
    marginTop: 20,
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subformButton: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subformDsiplay: {
    width: '100%',
    height: 50, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10, 
    borderColor: colors.primary, 
    borderWidth: 2,
    fontSize: 15,
    fontFamily: fonts.RR,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.primary
  },
  subformText: {
    fontSize: 15,
    fontFamily: fonts.RR,
    color: colors.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  submitButton: {
    width: '80%',
    height: 50,
    borderRadius: 100,
    backgroundColor: colors.secondary,
    fontSize: 15,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 15,
    fontFamily: fonts.RR,
    color: colors.background,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  checkboxContainer: {
    marginTop: 15,
    height: 'fit-content',
    width: '80%',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    textAlignVertical: 'center',
    gap: 10,
  },
  checkbox: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  errorMessage: {
    fontSize: 15,
    fontFamily: fonts.RR,
    color: colors.error,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 15,
  },
})