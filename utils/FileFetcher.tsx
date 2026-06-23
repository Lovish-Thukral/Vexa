import RNFS from 'react-native-fs';

const BLOCKED_FILE_PATHS = [
  'android/data',
  'android/obb',
  '.thumbnails',
  'cache',
  'system volume information',
];

const AlowedExtensions: string[] = ['cdr', 'psd', 'ai', 'pdf'];

export async function fetchFilesFromDirectory(CurruntPath: string) {
  let discoveredFiles: object[] = [];
  try {
    const files = await RNFS.readDir(CurruntPath);
    for (const file of files) {
      if (
        BLOCKED_FILE_PATHS.some(blockedPath =>
          file.path.toLowerCase().includes(blockedPath),
        )
      ) {
        continue;
      }
      if (file.isFile()) {
        const isAllowedExtension = AlowedExtensions.some(ext =>
          file.name.toLowerCase().endsWith(`.${ext}`),
        );
        if (isAllowedExtension) {
          discoveredFiles.push({
            name: file.name,
            path: file.path,
            size: file.size,
            lastModified: file.mtime,
            thumbnail: null, // Placeholder for thumbnail, can be generated later
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching files from directory:', error);
    throw error;
  }
  return discoveredFiles;
}
