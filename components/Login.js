import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../store/actions/SaveAction';
import * as MiscActions from '../store/actions/MiscActions';
import {
  loginApi,
  checkTokenValidApi,
  issueNewToken,
} from '../api/user/Signup.api';
import {getAuthToken} from '../api/storage/storage';
import AsyncStorage from '@react-native-community/async-storage';

export default function Login() {
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  useEffect(() => {
    checkForToken();
  }, []);

  const checkForToken = async () => {
    const token = await getAuthToken();
    console.log('login page pe token', token);
    if (token) {
      // check if token valid,call api for the same.
      const response = await checkTokenValidApi(token);
      if (response.status === 200) {
        dispatch(MiscActions.setIsLoggedIn(true));
        setShowLoader(false);
      } else {
        // alert("Token exired, Need new token")
        alert('Session expired, Please log in');
        setShowLoader(false);

        // const res = await issueNewToken(response.data.decoded.id);
        // console.log('res', res);
        // await AsyncStorage.setItem('jwtSecret', res.data.accessToken);
        // dispatch(MiscActions.setIsLoggedIn(true));
      }
    } else {
      // alert('No token found please login');
      console.log('No token found please login');
      setShowLoader(false);
    }
  };

  const handleLogin = async () => {
    const data = {
      email: email,
      password: password,
    };
    const response = await loginApi(data);
    console.log('response', response);
    if (response.status === 200) {
      handleSuccess(response);
      // const shuruKar = async () => {
      //   await AsyncStorage.setItem('jwtSecret', response.token);
      // };

      // dispatch(MiscActions.setIsLoggedIn(true));
    }
    if (response.status === 401) {
      handleError(response.status);
    }
    if (response.status === 404) {
      handleError(response.status);
    } else {
      console.log(response.status);
    }
  };

  const handleSuccess = async response => {
    try {
      await AsyncStorage.setItem('jwtSecret', response.data.token);
      dispatch(MiscActions.setIsLoggedIn(true));
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleError = status => {
    if (status === 401) {
      Alert.alert(
        'Alert',
        'Incorrect password',
        [
          {
            text: 'Ok',
            onPress: () => {},
          },
        ],
        {cancelable: true},
      );
    }
    if (status === 404) {
      Alert.alert(
        'Alert',
        'Incorrect email',
        [
          {
            text: 'Ok',
            onPress: () => {},
          },
        ],
        {cancelable: true},
      );
    }
  };

  return (
    <View style={styles.parentContainer}>
      <View style={styles.wrapperContainer}>
        <Image
          source={require('../assets/images/chef.jpg')}
          style={styles.image}
        />
        {showLoader ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            animating={showLoader}
          />
        ) : null}

        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.inputBox}
            onChangeText={text => setEmail(text)}
            placeholder="Enter Email"
          />
          <TextInput
            style={styles.inputBox}
            onChangeText={text => setPassword(text)}
            placeholder="Enter Password"
          />

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              handleLogin();
            }}>
            <View style={styles.loginTextContainer}>
              <Text style={{color: 'white'}}>LOGIN</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.notAMemberText}>
            Not a member?<Text> </Text>
            <Text
              onPress={() => {
                dispatch(MiscActions.showLoginScreen(false));
              }}
              style={{textDecorationLine: 'underline'}}>
              Signup
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dff9fb',
  },
  inputBox: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    width: '85%',
    marginTop: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  wrapperContainer: {
    width: '100%',
    height: '100%',
    marginTop: 60,
    display: 'flex',
    alignItems: 'center',
  },
  image: {width: '80%', height: '40%'},
  textInputContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginTop: '5%',
  },
  loginTextContainer: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    backgroundColor: '#1a8cff',
    marginTop: '5%',
    borderRadius: 10,
  },
  notAMemberText: {marginTop: 10, fontSize: 15},
});
