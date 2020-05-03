import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import * as Actions from '../store/actions/SaveAction';
import * as MiscActions from '../store/actions/MiscActions';
import * as UserActions from '../store/actions/UserActions';

import axios from 'axios';
import spoonacularApiKey from '../assets/constants/SpoonacularApiKey';
import Icon from 'react-native-vector-icons/FontAwesome';
import Octicon from 'react-native-vector-icons/Octicons';

import {useDispatch, useSelector} from 'react-redux';
import {getUserData} from '../api/user/UserOperations.api';

import {useIsFocused} from '@react-navigation/native';
import SearchFixed from './search/SearchFixed';

import coverPictureArray from '../components/extras/coverPictureArry';
import cuisinePictureArray from './extras/cuisinePictureArray';
import getRecipeFromApi from './functions/GetRecipeFromApi';

let HomeScreen1 = ({navigation, route}) => {
  const userDataInStore = useSelector(state => state.userReducer.user);
  const showSearchBar = useSelector(state => state.miscReducer.showSearchBar);
  let viewMoreCount = useSelector(state => state.miscReducer.viewMoreCount);
  const isFocused = useIsFocused();

  const [importedRecipes, setImportedRecipes] = useState(null);
  const [baseUrlSpoonacular, setBaseUrlSpoonacular] = useState();
  const [searchText, setSearchText] = useState('');
  const [randomRecipe, setRandomRecipe] = useState(null);

  useEffect(() => {
    fetchUserData();
    getRandomRecipe();
  }, []);

  useEffect(() => {
    dispatch(MiscActions.setViewMoreCount(0));
  }, [isFocused]);

  const getRandomRecipe = async () => {
    const dataToSend = {data: {category: 0}};
    const response = await getRecipeFromApi(dataToSend);
    setRandomRecipe(response.data.recipes[0]);
  };
  console.log('randomRecipe :>> ', randomRecipe);

  console.log('importedRecipes', importedRecipes);
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    const response = await getUserData();
    console.log('response', response);
    if (response.status === 200) {
      console.log('User data fetch succesful');
      // Update store
      dispatch(UserActions.updateUser(response.data));
      // setUserDataInStore(response.data);
    }
  };
  console.log('User data in store', userDataInStore);

  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const findRecipe = text => {
    console.log('text', text);
    let arr = [];
    if (text != '') {
      importedRecipes.filter(item => {
        if (item.title.toLowerCase().includes(text)) {
          console.log('item.title', item.title);
          console.log('item', item);
          arr.push(item);
        }
      });
      console.log('arr', arr);
      setFilteredRecipes([...arr]);
    } else {
      setFilteredRecipes(null);
    }
  };
  console.log('filteredRecipesState', filteredRecipes);

  const sendSearchObject = {
    data: {category: 0},
    navigation: navigation,
    placeholder: 'Search Food',
  };

  const handleFlatlistPress = item => {
    let data = {
      category: item.category,
      identifier: item.identifier,
      headerName: item.name,
    };
    navigation.navigate('CategoryHomescreen', data);
  };

  const goToDetailsScreen = () => {
    let data = {
      name: randomRecipe.title,
      itemId: randomRecipe.id,
      imageUrl: randomRecipe.image,
    };
    navigation.navigate('RecipeDetailsScreen', data);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.parentContainer}>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          style={{
            width: '100%',
          }}>
          <SearchFixed renderDetails={sendSearchObject} showFixedText={false} />

          {randomRecipe && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => goToDetailsScreen()}>
              <View style={styles.randomRecipeContainer}>
                <ImageBackground
                  source={{uri: randomRecipe.image}}
                  style={styles.randomRecipeImage}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      getRandomRecipe();
                    }}>
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        backgroundColor: 'white',
                        marginLeft: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        // borderTopRightRadius: 4,
                      }}>
                      <Icon name={'refresh'} size={18} color={'#111'} />
                    </View>
                  </TouchableOpacity>
                </ImageBackground>
                <Text style={styles.randomRecipeText}>
                  {randomRecipe.title}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <FlatList
            style={{marginVertical: 10}}
            data={coverPictureArray}
            keyExtractor={item => item.name}
            numColumns={3}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => handleFlatlistPress(item)}>
                  <View style={styles.flatlistItemContainer}>
                    <Image source={item.image} style={styles.flatListImage} />
                    <Text>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          <View
            style={{
              marginLeft: 5,
              borderWidth: 2,
              borderColor: '#f4511e',
              borderRadius: 17,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                marginLeft: 5,
                paddingVertical: 5,
                textAlign: 'center',
              }}>
              Cuisines From Around The Globe
            </Text>
            <View style={{marginLeft: 10, marginTop: 3}}>
              <Icon name={'chevron-right'} size={13} color={'#111'} />
            </View>
          </View>

          <FlatList
            style={{marginVertical: 10}}
            horizontal={true}
            data={cuisinePictureArray}
            keyExtractor={item => item.name}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => handleFlatlistPress(item)}>
                  <View style={styles.flatlistItemContainer}>
                    <Image
                      source={item.image}
                      style={styles.horizontalFlatlistImage}
                    />
                    <Text>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  parentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    width: '95%',
    paddingVertical: 5,
  },
  solocontainer: {
    height: 'auto',
    width: 190,
    // marginTop: 10,
    marginLeft: 3,
    marginEnd: 1,
    marginBottom: 5,
  },

  container: {
    height: 'auto',
    flex: 1,
  },
  textstyle: {
    color: 'red',
  },
  image: {
    height: 200,
    // width: 190,
    width: '100%',
    // margin: 1,
    // marginLeft: 1,
    borderRadius: 10,
  },
  imagecontainer: {
    marginTop: 10,
  },
  parentBackground: {
    backgroundColor: '#dff9fb',
    // backgroundColor: '#9c88ff',
    // minHeight: '100%',
    padding: '2.5%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    width: '82%',
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
  },
  randomRecipeContainer: {
    width: '100%',
    // height: '30%',
    display: 'flex',
    borderWidth: 2,
    borderColor: '#f4511e',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    // borderBottomRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 1,
  },
  randomRecipeImage: {width: '100%', height: 250},
  randomRecipeText: {padding: 5, fontSize: 18, textAlign: 'center'},
  flatlistItemContainer: {
    marginHorizontal: 3,
    marginVertical: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListImage: {width: 120, height: 140},
  horizontalFlatlistImage: {width: 120, height: 140},
});
export default HomeScreen1;
