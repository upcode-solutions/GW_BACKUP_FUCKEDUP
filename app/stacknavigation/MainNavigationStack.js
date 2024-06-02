import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useControl } from '../contexts/ControlProvider'

const Stack = createNativeStackNavigator();

import ApplicationNavigationStack from './ApplicationNavigationStack';
import VerificationStack from '../screenstack/VerificationStack';

export default function MainNavigationStack() {
    const { userAsyncData } = useControl();
    
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
           {
             userAsyncData.onVerify
             ? <Stack.Screen name="Verification" component={VerificationStack} />
             : <Stack.Screen name="Application" component={ApplicationNavigationStack} />
           }
        </Stack.Navigator>
    )
}