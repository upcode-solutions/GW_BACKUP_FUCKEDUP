import React, { createContext, useContext, useState, useEffect } from "react"; //import React basic library
import { View, Text, SafeAreaView } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage"; //import AsyncStorage library
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

import Loadingscreen from "../components/LoadingScreen";

const ControlContext = createContext();

const ControlProvider = ({ children }) => {

    const [userAsyncData, setUserAsyncData] = useState({
        isNewUser: true,
        isLoggedIn: false,
        onVerify: false,
        userInformation: {
            
        },
    });

    const [isloading, setIsLoading] = useState(true);

    useEffect(() => {
        const setData = async () => {
            await AsyncStorage.setItem("userData", JSON.stringify(userAsyncData));
            console.log("data was set");
            setIsLoading(false);
        };

        const getData = async () => {
            try {
                const userData = await AsyncStorage.getItem("userData");
                if (!userData) {
                    setData();
                }
                setUserAsyncData(JSON.parse(userData));
                console.log("dataFetched : ", userData);
            } catch (error) {
                console.error("Error fetching data from AsyncStorage:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getData();
    }, []);

    if (isloading) {
        return (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="LoadingScreen" component={Loadingscreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return ( 
        <ControlContext.Provider value={{ userAsyncData, setUserAsyncData }}>
            {children}
        </ControlContext.Provider>
    );

}
export const useControl = () => useContext(ControlContext);
export default ControlProvider