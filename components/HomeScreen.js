import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import * as Actions from '../store/actions/SaveAction';
import * as MiscActions from '../store/actions/MiscActions';

import axios from 'axios';
import spoonacularApiKey from '../assets/constants/SpoonacularApiKey';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';

let HomeScreen1 = ({navigation}) => {
  const recipeDataInStore = useSelector(state => state.saveReducer.recipes);
  const [importedRecipes, setImportedRecipes] = useState();
  const [baseUrlSpoonacular, setBaseUrlSpoonacular] = useState();
  console.log('recipeDataInStore', recipeDataInStore);
  const [x, setx] = useState();
  console.log('X check kar', x);

  // useEffect(() => {
  //   console.log('BHAAAAGOOOO');
  //   setx(recipeDataInStore);
  // }, [recipeDataInStore]);

  useEffect(() => {
    console.log('I ran');
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

  const renderFlatList = () => {
    return (
      <View style={{width: '98%'}}>
        <FlatList
          data={importedRecipes}
          keyExtractor={item => item.id}
          numColumns={2}
          extraData={recipeDataInStore}
          renderItem={({item, index}) => {
            return (
              <View style={styles.solocontainer}>
                <TouchableOpacity
                  onPress={() => {
                    let data = {
                      name: item.title,
                      itemId: item.id,
                      imageUrl: `${baseUrlSpoonacular + item.image}`,
                      price: '500',
                    };
                    navigation.navigate('RecipeDetailsScreen', data);
                  }}>
                  <View style={styles.container}>
                    <ImageBackground
                      source={{uri: `${baseUrlSpoonacular + item.image}`}}
                      style={styles.image}
                      imageStyle={{borderRadius: 15}}>
                      {recipeDataInStore.map(recipeItem =>
                        recipeItem.name === item.title ? (
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

                        {/* <View
                          style={{
                            width: '90%',
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: 'white',
                              fontSize: 15,
                            }}>
                            {item.title}
                          </Text>
                        </View>
                        <View style={{width: '10%'}}>
                          {recipeDataInStore.map(recipeItem =>
                            recipeItem.name === item.title ? (
                              <View>
                                <Icon
                                  // style={{marginLeft: '90%', marginTop: '92%'}}
                                  name={'bookmark'}
                                  size={20}
                                  color={'yellow'}
                                />
                              </View>
                            ) : null,
                          )}
                        </View> */}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
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
