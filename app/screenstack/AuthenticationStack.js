import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useControl } from '../contexts/ControlProvider'

import WelcomeScreen from "../screens/WelcomeScreen";
import AuthenticationScreen from "../screens/AuthenticationScreen";
import RegistrationScreen from "../screens/RegistrationScreen";

const Stack = createNativeStackNavigator();

export default function AuthenticationStack() {

    const { userAsyncData } = useControl();

    return(
        <Stack.Navigator initialRouteName={ userAsyncData.isNewUser ? "Welcome" : "Authentication"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Authentication" component={AuthenticationScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
        </Stack.Navigator>
    );
}