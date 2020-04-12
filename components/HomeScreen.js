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

let HomeScreen1 = ({navigation}) => {
  // const dataConnector = useSelector(state => state.userReducer.user);
  // const [userDataInStore, setUserDataInStore] = useState();
  const userDataInStore = useSelector(state => state.userReducer.user);
  const [importedRecipes, setImportedRecipes] = useState(null);
  const [baseUrlSpoonacular, setBaseUrlSpoonacular] = useState();

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
        )}
      </View>
    );
  };

  return <View style={styles.parentBackground}>{renderFlatList()}</View>;
};

const styles = {
  solocontainer: {
    height: 'auto',
    width: 190,
    marginTop: 10,
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
};
export default HomeScreen1;
