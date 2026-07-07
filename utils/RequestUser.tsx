// import { Platform, Linking, Alert } from "react-native";
// import RNFS from 'react-native-fs'; // Or your preferred file access library

// export const RequestStoragePermission = async () => {
//   if (Platform.OS !== 'android') return true;

//   // For Android 11 (API level 30) and above
//   if (Platform.Version >= 30) {
//     const hasAccess = await RNFS.exists('/sdcard'); // Fast native check trick
    
//     if (!hasAccess) {
//       Alert.alert(
//         "Permission Required",
//         "This app needs management access to all files to operate properly. Please enable it in the system settings.",
//         [
//           { text: "Cancel", style: "cancel" },
//           { 
//             text: "Open Settings", 
//             onPress: () => Linking.openSettings() 
//           }
//         ]
//       );
//       return false;
//     }
//     return true;
//   } 
  
//   // Fallback for Android 10 and below
//   // else {
//   //   const { PermissionsAndroid } = require('react-native');
//   //   const granted = await PermissionsAndroid.request(
//   //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//   //   );
//   //   return granted === PermissionsAndroid.RESULTS.GRANTED;
//   }
// // };
