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
import axios from 'axios';
import spoonacularApiKey from '../assets/constants/SpoonacularApiKey';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';

let HomeScreen1 = ({navigation}) => {
  const recipeDataInStore = useSelector(state => state.recipes);
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

  const dispatch = useDispatch();

  const renderFlatList = () => {
    return (
      <FlatList
        data={importedRecipes}
        keyExtractor={item => item.id}
        numColumns={2}
        extraData={x}
        renderItem={({item, index}) => {
          return (
            <View style={styles.solocontainer}>
              <TouchableOpacity
                onPress={() => {
                  let data = {
                    name: item.title,
                    calories: '30',
                    itemId: item.id,
                    imageUrl: `${baseUrlSpoonacular + item.image}`,
                    price: '500',
                  };
                  navigation.navigate('RecipeDetailsScreen', data);
                }}>
                <View style={styles.container}>
                  {/* <Image
                    source={{uri: `${baseUrlSpoonacular + item.image}`}}
                    style={styles.image}
                  /> */}
                  <ImageBackground
                    source={{uri: `${baseUrlSpoonacular + item.image}`}}
                    style={styles.image}>
                    {recipeDataInStore.map(recipeItem =>
                      recipeItem.name === item.name ? (
                        <View>
                          <Icon
                            style={{marginLeft: '90%', marginTop: '92%'}}
                            name={'bookmark'}
                            size={20}
                            color={'black'}
                          />
                        </View>
                      ) : null,
                    )}
                  </ImageBackground>
                  <Text style={{textAlign: 'center'}}> {item.title}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    );
  };

  return <View style={styles.parentBackground}>{renderFlatList()}</View>;
};

const styles = {
  solocontainer: {
    height: 'auto',
    width: 200,
    marginTop: 5,
    marginLeft: 1,
    marginEnd: 1,
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
    width: 190,
    margin: 1,
    marginLeft: 1,
    borderRadius: 10,
  },
  imagecontainer: {
    marginTop: 10,
  },
  parentBackground: {
    backgroundColor: '#ffeaa7',
  },
};
export default HomeScreen1;
