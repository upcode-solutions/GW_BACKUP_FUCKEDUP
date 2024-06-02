import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useControl } from "../contexts/ControlProvider";

import UserNavigationScreen from "./UserNavigationScreen";
import AuthenticationStack from "../screenstack/AuthenticationStack";

const Stack = createNativeStackNavigator();

export default function ApplicationNavigationStack() {
    const { userAsyncData } = useControl() 
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            {
                userAsyncData.isLoggedIn
                ? <Stack.Screen name="UserNavigationScreen" component={UserNavigationScreen}/>
                : <Stack.Screen name="AuthenticationStack" component={AuthenticationStack}/>
            }
        </Stack.Navigator>
    );
}