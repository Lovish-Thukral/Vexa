import {useEffect, useState} from 'react';

import { StatusBar, useColorScheme, View, Text } from 'react-native';
import {  SafeAreaProvider } from 'react-native-safe-area-context';
import NativeSampleModule from './specs/NativeSampleModule';
import { RequestStoragePermission } from './utils/RequestUser';

function App() {
const isDarkMode = useColorScheme() === 'dark';
const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

useEffect(() => {
  const requestPermission = async () => {
    const isPermitted = await RequestStoragePermission();
    setPermissionGranted(isPermitted);
  };
  requestPermission();
}, []);

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
      <Text> {permissionGranted ? "permitted" : "error"}</Text>

      </View>
    </SafeAreaProvider>
  );
}


export default App;
