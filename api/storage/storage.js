const KEY = 'jwtSecret';
import AsyncStorage from '@react-native-community/async-storage';

export const getAuthToken = async () => {
  try {
    const value2 = await AsyncStorage.getItem(KEY);
    if (value2 !== null) {
      console.log('value2', value2);
      return value2;
    } else {
      console.log('No token available');
    }
  } catch (e) {
    // error reading value
    console.log('e', e);
  }
};

// export const getAuthToken = async () => {
//   console.log('KEY', KEY);
//   const token = await AsyncStorage.getItem(KEY);
//   if (token === null) {
//     console.log('No token');
//     return null;
//   } else {
//     console.log('token in storage', token);

//     return token;
//   }
// };
