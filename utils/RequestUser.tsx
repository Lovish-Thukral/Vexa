import {Linking, Platform} from 'react-native';

export const RequestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    console.warn('Storage permission is only required on Android.');
    return true;
  }

  // MANAGE_EXTERNAL_STORAGE / All Files Access only exists on API 30+ (Android 11+)
  // Still valid through API 36 (Android 16) — Google hasn't removed it.
  if (Platform.Version < 30) {
    return true;
  }

  try {
    await Linking.sendIntent('android.settings.MANAGE_APP_ALL_FILES_ACCESS_PERMISSION');
    return true;
  } catch (err) {
    console.warn('Error requesting storage permission:', err);
    return false;
  }
};