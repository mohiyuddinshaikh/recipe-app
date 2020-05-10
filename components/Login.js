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
  KeyboardAvoidingView,
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
import alertComponent from './functions/Alert';
import colors from '../assets/constants/Colors';

export default function Login({navigation, route}) {
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(true);
  const [loginClickedLoader, setLoginClickedLoader] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showCredit, setShowCredit] = useState(true);

  console.log('navigation :>> ', navigation);
  console.log('route :>> ', route);

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
    setLoginClickedLoader(true);
    const data = {
      email: email,
      password: password,
    };
    const response = await loginApi(data);

    console.log('response', response);

    if (response) {
      if (response.status === 200) {
        handleSuccess(response);
      }
      if (response.status === 400) {
        alertComponent({subheading: response.data.message});
      }
      if (response.status === 401) {
        handleError(response.status);
        setLoginClickedLoader(false);
      }
      if (response.status === 404) {
        handleError(response.status);
        setLoginClickedLoader(false);
      } else {
        console.log('Inside else block');
        console.log(response.status);
        setLoginClickedLoader(false);
      }
    } else {
      alertComponent({subheading: 'Please check your internet connection '});
      setLoginClickedLoader(false);
    }
  };

  const handleSuccess = async response => {
    try {
      await AsyncStorage.setItem('jwtSecret', response.data.token);
      dispatch(MiscActions.setIsLoggedIn(true));
      setLoginClickedLoader(false);
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
        'Invalid email',
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
  const [changeColor1, setChangeColor1] = useState(false);
  const [changeColor2, setChangeColor2] = useState(false);

  return (
    <View style={styles.parentContainer}>
      <Image
        source={require('../assets/images/chef.jpg')}
        style={styles.image}
      />
      {showLoader ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color={colors.themeColor}
            animating={showLoader}
          />
        </View>
      ) : null}
      <View style={styles.textInputContainer}>
        <Text style={styles.inputLabelText}>Email</Text>
        <TextInput
          style={!changeColor1 ? styles.inputBox : styles.inputBoxActive}
          onChangeText={text => setEmail(text)}
          placeholder="Enter Email"
          onFocus={() => {
            setShowCredit(false);
            setChangeColor1(true);
          }}
          onBlur={() => {
            setShowCredit(true);
            setChangeColor1(false);
          }}
        />
        <Text style={styles.inputLabelText}>Password</Text>
        <TextInput
          style={!changeColor2 ? styles.inputBox : styles.inputBoxActive}
          onChangeText={text => setPassword(text)}
          placeholder="Enter Password"
          onFocus={() => {
            setShowCredit(false);
            setChangeColor2(true);
          }}
          onBlur={() => {
            setShowCredit(true);
            setChangeColor2(false);
          }}
        />

        <View
          style={{
            width: '100%',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              showLoader ? null : handleLogin();
            }}>
            <View style={styles.loginTextContainer}>
              {loginClickedLoader ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{color: 'white'}}>LOGIN</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.notAMemberText}>
          Not a member?<Text> </Text>
          <Text
            onPress={() => {
              showLoader ? null : dispatch(MiscActions.showLoginScreen(false));
            }}
            style={{textDecorationLine: 'underline'}}>
            Signup
          </Text>
        </Text>
      </View>

      {showCredit ? (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: colors.themeColor,
            display: 'flex',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 14, color: colors.white, paddingVertical: 3}}>
            Developed with &#x2665; by Mohiyuddin Shaikh
          </Text>
        </View>
      ) : null}
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
    // backgroundColor: '#dff9fb',
  },
  inputBox: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginTop: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputBoxActive: {
    height: 50,
    borderColor: colors.themeColor,
    borderWidth: 2,
    width: '100%',
    marginTop: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
  },

  image: {width: '80%', height: '40%'},
  textInputContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '85%',
    marginTop: '1%',
  },
  loginTextContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.themeColor,
    marginTop: '5%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
  },
  notAMemberText: {marginTop: 10, fontSize: 15},
  inputLabelText: {display: 'flex', alignSelf: 'flex-start', marginTop: 10},
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88',
  },
});
