import { open } from 'react-native-quick-sqlite';

export interface FileRecord {
  name: string;
  path: string;
  size: number;
  lastModified: string;
  thumbnail?: string | null;
}

export default class Database {
  private static db = open({
    name: 'CachedIndexes.db',
  });

  static {
    this.createTables();
  }

  private static createTables(): void {
    this.db.execute(`
      CREATE TABLE IF NOT EXISTS Files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        path TEXT UNIQUE NOT NULL,
        size INTEGER NOT NULL,
        lastModified TEXT NOT NULL,
        thumbnail TEXT,
        lastScanned INTEGER NOT NULL
      );
    `);
  }

  static insertOrUpdateFiles(
    files: FileRecord[],
    scanId: number,
  ): number {
    try {
      this.db.execute('BEGIN TRANSACTION');
      for (const file of files) {
        this.db.execute(
          `
          INSERT INTO Files (
            name,
            path,
            size,
            lastModified,
            thumbnail,
            lastScanned
          )
          VALUES (?, ?, ?, ?, ?, ?)

          ON CONFLICT(path)
          DO UPDATE SET
            name = excluded.name,
            size = excluded.size,
            lastModified = excluded.lastModified,
            thumbnail = COALESCE(
              excluded.thumbnail,
              Files.thumbnail
            ),
            lastScanned = excluded.lastScanned;
          `,
          [
            file.name,
            file.path,
            file.size,
            file.lastModified,
            file.thumbnail ?? null,
            scanId,
          ],
        );
      }

      this.db.execute('COMMIT');

      return scanId;
    } catch (error) {
      this.db.execute('ROLLBACK');
      throw error;
    }
  }

  static removeStaleFiles(
    currentScanId: number,
  ): void {
    this.db.execute(
      `
      DELETE FROM Files
      WHERE lastScanned <> ?
      `,
      [currentScanId],
    );
  }

  static updateThumbnail(
    fileId: number,
    thumbnail: string,
  ): void {
    this.db.execute(
      `
      UPDATE Files
      SET thumbnail = ?
      WHERE id = ?
      `,
      [thumbnail, fileId],
    );
  }

  static getConnection() {
    return this.db;
  }
}