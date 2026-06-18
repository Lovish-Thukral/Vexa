import { StatusBar, useColorScheme, View, Text } from 'react-native';
import {  SafeAreaProvider } from 'react-native-safe-area-context';
import NativeSampleModule from './specs/NativeSampleModule';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>NativeSampleModule.getString(): {NativeSampleModule.reverseString("Hellowwwwww")}</Text>

      </View>
    </SafeAreaProvider>
  );
}


export default App;
