import { NavigationContainer } from "@react-navigation/native"; //import navigation container react navigation
import ControlProvider from "./app/contexts/ControlProvider"; //import control provider context
import ThemeProvider from "./app/contexts/ThemeProvider"; //import theme provider context

import MainNavigationStack from "./app/stacknavigation/MainNavigationStack"; //import navigation stack

export default function App() {
  return (
    <ControlProvider>
      <ThemeProvider>
        <NavigationContainer>
          <MainNavigationStack/>
        </NavigationContainer>
      </ThemeProvider>
    </ControlProvider>
  );
}