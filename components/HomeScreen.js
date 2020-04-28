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

let HomeScreen1 = ({navigation, route}) => {
  const userDataInStore = useSelector(state => state.userReducer.user);
  const showSearchBar = useSelector(state => state.miscReducer.showSearchBar);
  let viewMoreCount = useSelector(state => state.miscReducer.viewMoreCount);
  const isFocused = useIsFocused();
  console.log('viewMoreCount :>> ', viewMoreCount);

  const [importedRecipes, setImportedRecipes] = useState(null);
  const [baseUrlSpoonacular, setBaseUrlSpoonacular] = useState();
  const [searchText, setSearchText] = useState('');
  console.log('route in homescreen', route);

  useEffect(() => {
    console.log('I ran');
    fetchUserData();
    // getRecipeFromApi();
  }, []);

  useEffect(() => {
    dispatch(MiscActions.setViewMoreCount(0));
  }, [isFocused]);

  const coverPictureArray = [
    {
      name: 'Chicken Corner',
      image: require('../assets/images/cover/chicken.jpg'),
      category: 1,
      identifier: 'chicken',
    },
    {
      name: 'Paneer Sizzlers',
      image: require('../assets/images/cover/paneer.jpeg'),
      category: 1,
      identifier: 'paneer',
    },
    {
      name: 'Pizza Mania',
      image: require('../assets/images/cover/pizza.jpg'),
      category: 3,
      identifier: 'pizza',
    },
    {
      name: 'Biryani Blast',
      image: require('../assets/images/cover/biryani.jpeg'),
      category: 3,
      identifier: 'biryani',
    },
    {
      name: 'Lunch',
      image: require('../assets/images/cover/lunch.jpg'),
      category: 2,
      identifier: 'main course',
    },
    {
      name: 'Breakfast',
      image: require('../assets/images/cover/breakfast.jpg'),
      category: 2,
      identifier: 'breakfast',
    },
    {
      name: 'Snacks',
      image: require('../assets/images/cover/snack.jpg'),
      category: 2,
      identifier: 'snack',
    },
    {
      name: 'Soups',
      image: require('../assets/images/cover/soup.jpg'),
      category: 2,
      identifier: 'soup',
    },
    {
      name: 'Desserts',
      image: require('../assets/images/cover/dessert.jpg'),
      category: 2,
      identifier: 'dessert',
    },
  ];

  const getRecipeFromApi = async () => {
    const foodItem = 'biryani';
    const numberOfResults = '10';
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/search?apiKey=${spoonacularApiKey}&query=${foodItem}&number=${numberOfResults}&instructionsRequired=true`,
    );
    console.log(response);
    setImportedRecipes(response.data.results);
    setBaseUrlSpoonacular(response.data.baseUri);
  };
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

  const renderFlatList = () => {
    return (
      <View style={{width: '98%'}}>
        {importedRecipes === null || userDataInStore === null ? (
          <View
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 15, marginBottom: 10}}>
              Loading Delicacies
            </Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View style={{paddingBottom: showSearchBar ? 190 : null}}>
            <FlatList
              data={importedRecipes}
              keyExtractor={item => item.id}
              numColumns={2}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.solocontainer}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        let data = {
                          name: item.title,
                          itemId: item.id,
                          imageUrl: `${baseUrlSpoonacular + item.image}`,
                          price: '500',
                        };
                        navigation.navigate('RecipeDetailsScreen', data);
                        setFilteredRecipes(null);
                        setSearchText('');
                      }}>
                      <View style={styles.container}>
                        <ImageBackground
                          source={{uri: `${baseUrlSpoonacular + item.image}`}}
                          style={styles.image}
                          // imageStyle={{borderRadius: 15}}
                        >
                          {userDataInStore &&
                            userDataInStore.recipes.map(recipeItem =>
                              recipeItem.recipeName === item.title ? (
                                <View>
                                  <Icon
                                    style={{marginLeft: '5%', marginTop: '91%'}}
                                    // style={{marginLeft: '90%'}}
                                    name={'bookmark'}
                                    size={20}
                                    color={'#f4511e'}
                                  />
                                </View>
                              ) : null,
                            )}
                        </ImageBackground>
                        <View
                          style={{
                            height: 'auto',
                            backgroundColor: 'white',
                            display: 'flex',
                            justifyContent: 'center',

                            // borderRadius: 5,
                          }}>
                          <View
                            style={{
                              width: '95%',
                              padding: 5,
                              flex: 1,
                              flexDirection: 'row',
                              display: 'flex',
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: 'black',
                                fontSize: 16,
                                fontWeight: '100',
                              }}>
                              {item.title}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    );
  };

  const renderSearchBar = () => {
    return (
      <View
        style={{
          width: '94%',
          flexDirection: 'row',
          paddingBottom: 10,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search Recipe"
            onChangeText={async text => {
              await setSearchText(text);
              findRecipe(text.toLowerCase());
            }}
            value={searchText}
          />
          {(searchText && searchText !== null) || searchText != '' ? (
            <Icon
              name={'close'}
              size={15}
              color={'#111'}
              style={{marginRight: 10}}
              onPress={() => {
                setSearchText('');
                setFilteredRecipes(null);
              }}
            />
          ) : null}
        </View>

        <View
          style={{
            height: 45,
            width: '8%',
            marginTop: 10,
            borderRadius: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '1%',
          }}>
          <Icon
            name={'search'}
            size={22}
            color={'#111'}
            onPress={() => findRecipe(searchText.toLowerCase())}
          />
        </View>
        <View
          style={{
            height: 45,
            width: '9%',
            marginTop: 10,
            borderRadius: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // marginLeft: '1%',
          }}>
          <Octicon
            name={'settings'}
            size={24}
            color={'black'}
            onPress={() => findRecipe(searchText.toLowerCase())}
          />
        </View>
        <View>
          <Icon
            name={'close'}
            size={18}
            color={'black'}
            style={{marginTop: 10}}
            onPress={() => {
              dispatch(MiscActions.showSearchBar(false));
            }}
          />
        </View>
      </View>
    );
  };

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

  const [x, setx] = useState([]);
  var pracFlat = ['1', '1', '1', '1', '1', '1', '1', '1', '1'];
  return (
    <View style={styles.mainContainer}>
      <View style={styles.parentContainer}>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          style={{
            width: '100%',
          }}>
          <SearchFixed renderDetails={sendSearchObject} showFixedText={false} />

          <View style={styles.randomRecipeContainer}>
            <Image
              source={require('../assets/images/cover/pizza.jpg')}
              style={{width: '100%', height: 300}}
            />
            <Text>I have random recipe</Text>
          </View>
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
                  onPress={() => {
                    let data = {
                      category: item.category,
                      identifier: item.identifier,
                      headerName: item.name,
                    };
                    navigation.navigate('CategoryHomescreen', data);
                  }}>
                  <View
                    style={{
                      marginHorizontal: 3,
                      marginVertical: 5,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={item.image}
                      style={{width: 120, height: 140}}
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

const styles = {
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
    borderColor: 'black',
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
export default HomeScreen1;
