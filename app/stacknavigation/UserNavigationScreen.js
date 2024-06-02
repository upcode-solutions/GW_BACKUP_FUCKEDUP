import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useControl } from "../contexts/ControlProvider";
import React, { useState, useEffect } from "react";
import { storage } from '../database/config'
import { ref, getDownloadURL } from "firebase/storage";

import ClientStack from "../screenstack/ClientStack";
import RiderStack from "../screenstack/RiderStack";
import Loadingscreen from "../components/LoadingScreen";


const Stack = createNativeStackNavigator();

export default function UserNavigationScreen() {
    
    const { userAsyncData, setUserAsyncData } = useControl();
    const [isLoading, setIsLoading] = useState(true);

    const getUserData = async() => {
        try {
            const photoTypes = [['profile'], ['idFront'], ['idBack']];
            const downloadDataPromises = photoTypes.map(async (photoType) => {
                const downloadURL = await getDownloadURL(ref(storage, `users/${userAsyncData.userInformation.userType}/${userAsyncData.userInformation.uid}/${userAsyncData.userInformation.uid}-${photoType}.jpg`));
                const fetchURL = await fetch(downloadURL);
                const blob = await fetchURL.blob();
                const base64Image = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                return base64Image;
                })
            const downloadURLs = await Promise.all(downloadDataPromises);
            setUserAsyncData({ ...userAsyncData, userInformation: {...userAsyncData.userInformation, profilePhoto: downloadURLs[0], idFront: downloadURLs[1], idBack: downloadURLs[2]}})
            setIsLoading(false);
        } catch (error) {
            setUserAsyncData({ ...userAsyncData, isLoggedIn: false, userInformation: {} });
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    if (isLoading) {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Loading" component={Loadingscreen} ></Stack.Screen>
            </Stack.Navigator>
        );
    } else {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {
                    userAsyncData.userInformation.userType === "rider" 
                    ? <Stack.Screen name="Rider" component={RiderStack} ></Stack.Screen> 
                    : <Stack.Screen name="Client" component={ClientStack}></Stack.Screen>
                }
            </Stack.Navigator>
        );
    }
};