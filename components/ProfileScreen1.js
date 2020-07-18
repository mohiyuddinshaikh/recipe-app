import React, {useState, useEffect, useLayoutEffect, Fragment} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import firebase from '../firebase/Firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import {
  View,
  Text,
  FlatList,
  Button,
  ImageBackground,
  Platform,
  Image,
  ScrollView,
  ToastAndroid,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import RedirectToLogin from './RedirectToLogin';
import alertComponent from './functions/Alert';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../assets/constants/Colors';
import {updateUserData} from '../api/user/UserOperations.api';
import toastComponent from './functions/Toast';
import * as UserActions from '../store/actions/UserActions';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {uploadImage} from '../api/imageupload/uploadImage';

export default function ProfileScreen1({navigation, route}) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.miscReducer.isLoggedIn);
  const [showContent, setShowContent] = useState(false);
  const [loader, setLoader] = useState(false);

  console.log('isLoggedIn :>> ', isLoggedIn);
  console.log('navigation :>> ', navigation);

  const userDataInStore = useSelector(state => state.userReducer.user);
  console.log('profile screen data', userDataInStore);

  useFocusEffect(() => {
    someFunction();
  }, []);

  const someFunction = () => {
    if (isLoggedIn == true) {
      setShowContent(true);
    } else {
      alertComponent({subheading: 'You are not logged in'});
      navigation.navigate('Home');
    }
  };

  const [changeColor1, setChangeColor1] = useState(false);
  const [changeColor2, setChangeColor2] = useState(false);
  const [newName, setNewName] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const handleUpdate = async () => {
    if (newName && newName.length !== 0) {
      if (userDataInStore.name === newName) {
        alertComponent({
          subheading: 'Please change information before updating',
        });
      } else {
        let regExpName = /^[a-zA-Z]+$/;
        if (regExpName.test(newName)) {
          setShowLoader(true);
          let data = {name: newName};
          const response = await updateUserData(data);
          console.log('response :>> ', response);
          if (response.status === 200) {
            dispatch(UserActions.updateUser(data));
            toastComponent({message: 'Update Successful'});
            setShowLoader(false);
          } else {
            alertComponent({
              subheading: 'Something went wrong, Please try agian later',
            });
            setShowLoader(false);
          }
        } else {
          alertComponent({
            subheading: 'Invalid format',
          });
        }
      }
    } else {
      alertComponent({subheading: 'Name cannot be blank'});
    }
  };

  const [hasChanged, setHasChanged] = useState(false);

  const storeLocalUriToDatabase = async uri => {
    let data = {photo: uri};
    const response = await updateUserData(data);
    console.log('response :>> ', response);
  };

  const image =
    'https://res.cloudinary.com/recipecloudmoin/image/upload/v1594995906/chef_ciphmo.jpg';

  const [photo, setPhoto] = useState(
    userDataInStore.photo ? userDataInStore.photo : null,
  );

  const selectPhotoTapped = () => {
    const options = {
      title: 'Select Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.uri;
        const type = response.type;
        const name = response.fileName;
        const data = response.data;
        const source = {
          uri,
          type,
          name,
        };
        console.log('Image ', source);
        cloudinaryUpload(source);
      }
    });
  };

  const cloudinaryUpload = async photo => {
    setLoader(true);
    const data = new FormData();
    data.append('file', photo);
    data.append('upload_preset', 'recipepreset');
    data.append('cloud_name', 'recipecloudmoin');
    console.log('data :>> ', data);
    const response = await uploadImage(data);
    console.log('response :>> ', response);
    if (response.status == 200) {
      setPhoto(response.data.secure_url);
      setLoader(false);
      // Update database
      let updatedUserData = {
        photo: response.data.secure_url,
      };
      const resp = await updateUserData(updatedUserData);
      console.log('resp :>> ', resp);
      if (resp.status == 200) {
        toastComponent({message: 'Update Successful'});
      }
    }
  };

  return (
    <View style={styles.parentContainer}>
      {showContent
        ? userDataInStore && (
            <View
              style={{
                width: '90%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View>
                {loader ? (
                  <View>
                    <ActivityIndicator color={colors.themeColor} />
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      selectPhotoTapped();
                    }}>
                    {photo == null ? (
                      <Image
                        source={{uri: image}}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                        }}
                      />
                    ) : (
                      <Image
                        source={{uri: photo}}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                        }}
                      />
                    )}

                    <Icon
                      style={styles.cameraIcon}
                      name={'camera'}
                      size={12}
                      color={colors.themeColor}
                      onPress={() => {
                        selectPhotoTapped();
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.helloText}>
                Hello {userDataInStore.name} !
              </Text>

              <TextInput
                style={!changeColor1 ? styles.inputBox : styles.inputBoxActive}
                onChangeText={text => {
                  console.log(text);
                  setNewName(text);
                  setHasChanged(true);
                }}
                value={!hasChanged ? userDataInStore.name : newName}
                placeholder={'Name'}
                onFocus={() => setChangeColor1(true)}
                onBlur={() => setChangeColor1(false)}
              />
              <TextInput
                editable={false}
                style={!changeColor2 ? styles.inputBox : styles.inputBoxActive}
                onChangeText={text => {
                  console.log(text);
                  setSearchText(text);
                  autoCompleteSearch(text);
                }}
                value={userDataInStore.email}
                placeholder={'Email'}
                onFocus={() => setChangeColor2(true)}
                onBlur={() => setChangeColor2(false)}
              />

              <View
                style={{
                  width: '100%',
                  marginTop: 15,
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => (showLoader ? null : handleUpdate())}>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: colors.themeColor,
                      borderRadius: 10,
                    }}>
                    {showLoader ? (
                      <ActivityIndicator
                        color={colors.white}
                        style={{paddingVertical: 10}}
                      />
                    ) : (
                      <Text style={styles.updateText}>Update</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#dff9fb',
  },
  helloText: {fontSize: 17, textTransform: 'capitalize', marginTop: 10},
  inputBox: {
    width: '100%',
    // borderWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: 5,
    borderRadius: 5,
  },
  inputBoxActive: {
    width: '100%',
    // borderWidth: 1,
    borderBottomWidth: 2,
    borderBottomColor: colors.themeColor,
    marginTop: 5,
    borderRadius: 5,
  },
  updateText: {
    textAlign: 'center',
    paddingVertical: 10,
    color: colors.white,
  },
  cameraIcon: {marginLeft: 'auto', marginTop: -10, marginRight: 5},
});
