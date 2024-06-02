import { createNativeStackNavigator } from "@react-navigation/native-stack";

import VerificationScreen from "../screens/VerificationScreen";

const Stack = createNativeStackNavigator();

export default function VerificationStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        </Stack.Navigator>
    );
}