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
} from 'react-native';
import * as Actions from '../store/actions/SaveAction';
import * as MiscActions from '../store/actions/MiscActions';
import * as UserActions from '../store/actions/UserActions';

import axios from 'axios';
import firebase from '../assets/firebase/Firebase';
import spoonacularApiKey from '../assets/constants/SpoonacularApiKey';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {getUserData} from '../api/user/UserOperations.api';

let HomeScreen1 = ({navigation, route}) => {
  // const dataConnector = useSelector(state => state.userReducer.user);
  // const [userDataInStore, setUserDataInStore] = useState();
  const userDataInStore = useSelector(state => state.userReducer.user);
  const [importedRecipes, setImportedRecipes] = useState(null);
  const [baseUrlSpoonacular, setBaseUrlSpoonacular] = useState();
  const [searchText, setSearchText] = useState(null);
  console.log('route in homescreen', route);

  useEffect(() => {
    console.log('I ran');
    fetchUserData();
    getRecipeFromApi();
  }, []);

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
        {importedRecipes === null ? (
          <View
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 15, marginBottom: 10}}>
              Loading Deliciousness
            </Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View style={{height: 'auto', paddingBottom: 130}}>
            <FlatList
              data={importedRecipes}
              keyExtractor={item => item.id}
              numColumns={2}
              // extraData={userDataInStore.recipes}
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
                        // navigation.navigate('xscreen');
                      }}>
                      <View style={styles.container}>
                        <ImageBackground
                          source={{uri: `${baseUrlSpoonacular + item.image}`}}
                          style={styles.image}
                          imageStyle={{borderRadius: 15}}>
                          {userDataInStore.recipes.map(recipeItem =>
                            recipeItem.recipeName === item.title ? (
                              <View>
                                <Icon
                                  style={{marginLeft: '88%', marginTop: '3%'}}
                                  // style={{marginLeft: '90%'}}
                                  name={'bookmark'}
                                  size={20}
                                  color={'yellow'}
                                />
                              </View>
                            ) : null,
                          )}
                        </ImageBackground>
                        <View
                          style={{
                            height: 'auto',
                            backgroundColor: 'black',
                            display: 'flex',
                            justifyContent: 'center',
                            borderRadius: 5,
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
                            <Text style={{textAlign: 'center', color: 'white'}}>
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

  const [filteredRecipes, setFilteredRecipes] = useState([]);
  // useEffect(() => {
  //   renderSearchResults();
  // }, [filteredRecipes]);

  const findRecipe = text => {
    console.log('text', text);
    let arr = [];
    importedRecipes.filter(item => {
      if (item.title.toLowerCase().includes(text)) {
        console.log('item.title', item.title);
        console.log('item', item);
        arr.push(item);
      }
    });
    console.log('arr', arr);
    setFilteredRecipes([...arr]);
  };
  console.log('filteredRecipesState', filteredRecipes);

  const [x, setx] = useState([]);

  return (
    <View style={styles.parentBackground}>
      {/* <Text onPress={() => setx([...x, '1'])}>CLick me</Text> */}
      <View
        style={{
          width: '95%',
          flexDirection: 'row',
          paddingBottom: 10,
          display: 'flex',
        }}>
        <View style={styles.searchBox}>
          <TextInput
            // style={styles.searchBox}
            placeholder="Search Recipe"
            onChangeText={text => {
              setSearchText(text);
              findRecipe(searchText.toLowerCase());
            }}
            value={searchText}
          />
          {searchText !== null || searchText != '' ? (
            <Icon
              name={'close'}
              size={15}
              color={'#111'}
              style={{marginRight: 10}}
              onPress={() => {
                setSearchText('');
              }}
            />
          ) : null}
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
            marginLeft: '1%',
          }}>
          <Icon
            name={'search'}
            size={23}
            color={'#111'}
            // onPress={() => searchRecipe(searchText)}
            onPress={() => findRecipe(searchText.toLowerCase())}
          />
        </View>
      </View>
      {/* {renderSearchResults()} */}

      {/* {x &&
        x.length > 0 &&
        x.map((item, index) => {
          return (
            <View
              style={{
                width: '90%',
                backgroundColor: 'white',
                color: 'black',
                height: 40,
              }}>
              <Text> Recipe {index + 1}</Text>
            </View>
          );
        })} */}

      {filteredRecipes &&
        filteredRecipes.length > 0 &&
        filteredRecipes.map((item, index) => {
          return (
            <View
              style={{
                width: '95%',
                backgroundColor: 'white',
                color: 'black',
                height: 45,
                display: 'flex',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  let data = {
                    name: item.title,
                    itemId: item.id,
                    imageUrl: `${baseUrlSpoonacular + item.image}`,
                  };
                  navigation.navigate('RecipeDetailsScreen', data);
                }}>
                <Text> {item.title}</Text>
              </TouchableOpacity>
            </View>
          );
        })}

      {renderFlatList()}
    </View>
  );
};

const styles = {
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
    // backgroundColor: '#ffeaa7',
    backgroundColor: '#dff9fb',
    display: 'flex',
    alignItems: 'center',
  },
  searchBox: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    width: '91%',
    // width: '99%',
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
  },
};
export default HomeScreen1;
