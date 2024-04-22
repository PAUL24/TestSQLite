/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import SQLiteHelper from './SQLiteHelper';
//first name, last name, last added date,  submit
import Toast from 'react-native-toast-message';
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [data, setData] = useState<string[]>([]);

  const dbHelper = new SQLiteHelper();

  const handleInsertProfile = async () => {
    const db = await dbHelper.openDatabase();
    try {
      if (firstname.length === 0 || lastname.length === 0) {
        Toast.show({
          type: 'error',
          text1: 'Invalid',
          text2: 'Provide valid inputs!',
        });
        return;
      }
      await dbHelper.insertProfile(db, firstname, lastname);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile added successfully!',
      });
    } catch (error) {
      console.error('Error inserting profile:', error);
    } finally {
      dbHelper.closeDatabase(db);
    }
  };

  const handleRetrieveProfiles = async () => {
    const db = await dbHelper.openDatabase();
    try {
      const profiles = await dbHelper.retrieveProfiles(db);
      console.log('Retrieved profiles:', profiles);
      setData(profiles);
    } catch (error) {
      console.error('Error retrieving profiles:', error);
    } finally {
      dbHelper.closeDatabase(db);
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
              padding: 16,
            }}>
            <Text style={styles.sectionTitle}>SQLite Test</Text>
            <TextInput
              value={firstname}
              onChangeText={setFirstname}
              placeholder="First Name"
              style={styles.textInput}
            />
            <TextInput
              value={lastname}
              onChangeText={setLastname}
              placeholder="Last Name"
              style={styles.textInput}
            />

            <TouchableOpacity
              onPress={() => {
                console.log(firstname + ' ' + lastname);
                handleInsertProfile();
              }}>
              <Text style={styles.buttontxt}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleRetrieveProfiles();
              }}>
              <Text style={styles.buttontxt}>Retrieve Data</Text>
            </TouchableOpacity>

            <Text style={styles.textout}>{JSON.stringify(data)}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  textout: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 24,
  },
  buttontxt: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#000',
    padding: 16,
    fontSize: 18,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
