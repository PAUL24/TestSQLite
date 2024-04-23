// DatabaseHelper.ts

import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

interface DatabaseHelper {
  openDatabase(): Promise<SQLiteDatabase>;
  closeDatabase(db: SQLiteDatabase): void;
  insertProfile(
    db: SQLiteDatabase,
    firstname: string,
    lastname: string,
  ): Promise<void>;
  retrieveProfiles(db: SQLiteDatabase): Promise<string[]>;
}

class SQLiteHelper implements DatabaseHelper {
  // openDatabase(): Promise<SQLiteDatabase> {
  //   return SQLite.openDatabase({name: 'test.db', location: 'default'});
  // }

  openDatabase(): Promise<SQLiteDatabase> {
    return new Promise((resolve, reject) => {
      SQLite.openDatabase(
        {name: 'test.db', location: 'default'},
        db => {
          if (db) {
            // Database opened successfully
            this.createProfilesTable(db)
              .then(() => resolve(db))
              .catch(error => reject(error));
          } else {
            // Database opening failed
            reject(new Error('Failed to open database'));
          }
        },
        error => {
          // Error opening the database
          reject(error);
        },
      );
    });
  }

  closeDatabase(db: SQLiteDatabase): void {
    db.close();
  }

  createProfilesTable(db: SQLiteDatabase): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Profiles (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT, datetime TEXT)',
          [],
          () => {
            // Table created successfully
            resolve();
          },
          error => {
            // Error creating table
            reject(error);
          },
        );
      });
    });
  }

  insertProfile(
    db: SQLiteDatabase,
    firstname: string,
    lastname: string,
  ): Promise<void> {
    const currentTime = new Date().toISOString();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO Profiles (firstname, lastname, datetime) VALUES (?, ?, ?)',
          [firstname, lastname, currentTime],
          (_, results) => {
            if (results.rowsAffected > 0) {
              resolve();
            } else {
              reject(new Error('Failed to insert profile'));
            }
          },
          (_, error) => reject(error),
        );
      });
    });
  }

  retrieveProfiles(db: SQLiteDatabase): Promise<string[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT firstname, lastname, datetime FROM Profiles',
          [],
          (_, {rows}) => {
            const profiles: string[] = [];
            for (let i = 0; i < rows.length; i++) {
              profiles.push(
                `${rows.item(i).firstname} ${rows.item(i).lastname} : ${
                  rows.item(i).datetime
                }`,
              );
            }
            resolve(profiles);
          },
          (_, error) => reject(error),
        );
      });
    });
  }
}

export default SQLiteHelper;
