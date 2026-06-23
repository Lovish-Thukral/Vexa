import RNFS from 'react-native-fs';
import {decode as atob} from 'react-native-base64';

export type FileFormat =
  | 'OLDCDR'
  | 'NEWCDR'
  | 'OLDAI'
  | 'NEWAI'
  | 'PDF'
  | 'PSD'
  | 'UNKNOWN';

export interface FormatResult {
  type: FileFormat;
  verified: boolean;
  extension: string;
}

export default class VerifyFileFormat {
  private static readonly HEADER_LENGTH = 8;

  static async getHeader(filePath: string): Promise<Uint8Array | null> {
    try {
      const base64 = await RNFS.read(
        filePath,
        16, // length
        0, // position
        'base64',
      );

      if (!base64) {
        return null;
      }

      const binary = atob(base64);

      const header = new Uint8Array(
        Math.min(this.HEADER_LENGTH, binary.length),
      );

      for (let i = 0; i < header.length; i++) {
        header[i] = binary.charCodeAt(i);
      }

      return header;
    } catch (error) {
      console.error('Failed to read header:', error);
      return null;
    }
  }

  static getExtension(filePath: string): string {
    const match = /\.([^.]+)$/.exec(filePath);

    return match?.[1]?.toLowerCase() ?? 'unknown';
  }

  static async verify(filePath: string): Promise<FormatResult> {
    const extension = this.getExtension(filePath);
    const header = await this.getHeader(filePath);

    if (!header || header.length < 4) {
      return {
        type: 'UNKNOWN',
        verified: false,
        extension,
      };
    }

    const isPDF =
      header[0] === 0x25 &&
      header[1] === 0x50 &&
      header[2] === 0x44 &&
      header[3] === 0x46;

    const isPSD =
      header[0] === 0x38 &&
      header[1] === 0x42 &&
      header[2] === 0x50 &&
      header[3] === 0x53;

    const isRIFF =
      header[0] === 0x52 &&
      header[1] === 0x49 &&
      header[2] === 0x46 &&
      header[3] === 0x46;

    const isOldAI =
      header[0] === 0x25 &&
      header[1] === 0x21 &&
      header[2] === 0x50 &&
      header[3] === 0x53;

    const isZIP =
      header[0] === 0x50 &&
      header[1] === 0x4b &&
      header[2] === 0x03 &&
      header[3] === 0x04;

    switch (extension) {
      case 'cdr':
        if (isRIFF)
          return {
            type: 'OLDCDR',
            verified: true,
            extension,
          };

        if (isZIP)
          return {
            type: 'NEWCDR',
            verified: true,
            extension,
          };
        break;

      case 'ai':
        if (isOldAI)
          return {
            type: 'OLDAI',
            verified: true,
            extension,
          };

        if (isPDF)
          return {
            type: 'NEWAI',
            verified: true,
            extension,
          };
        break;

      case 'pdf':
        if (isPDF)
          return {
            type: 'PDF',
            verified: true,
            extension,
          };
        break;

      case 'psd':
        if (isPSD)
          return {
            type: 'PSD',
            verified: true,
            extension,
          };
        break;

      case 'zip':
        if (isZIP)
          return {
            type: 'NEWCDR',
            verified: false,
            extension,
          };
        break;
    }

    // Fallback detection

    if (isPSD) return { type: 'PSD', verified: false, extension };

    if (isOldAI) return { type: 'OLDAI', verified: false, extension };

    if (isRIFF) return { type: 'OLDCDR', verified: false, extension };

    if (isPDF) return { type: 'PDF', verified: false, extension };

    if (isZIP) return { type: 'NEWCDR', verified: false, extension };

    return {
      type: 'UNKNOWN',
      verified: false,
      extension,
    };
  }
}
