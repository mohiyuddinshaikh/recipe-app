import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../store/actions/SaveAction';
import * as MiscActions from '../store/actions/MiscActions';
import * as UserActions from '../store/actions/UserActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import spoonacularApiKey from '../assets/constants/SpoonacularApiKey';
import {Table, Row, Rows} from 'react-native-table-component';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {updateUserData, removeRecipe} from '../api/user/UserOperations.api';
import {useIsFocused} from '@react-navigation/native';
import colors from '../assets/constants/Colors';

export default function RecipeDetailsScreen1({navigation, route}) {
  const dispatch = useDispatch();
  // const recipeDataInStore = useSelector(state => state.saveReducer.recipes);
  let userDataInStore = useSelector(state => state.userReducer.user);
  const isCallerSavedScreen = useSelector(
    state => state.miscReducer.isCallerSavedScreen,
  );
  const [ingredientsFromApi, setIngredientsFromApi] = useState();
  const [recipeDetailInformation, setRecipeDetailInformation] = useState();
  console.log(route.params);
  console.log('route', route);
  const itemName = route.params.name;
  const itemId = route.params.itemId;
  const itemImage = route.params.imageUrl;
  console.log('itemImage :>> ', itemImage);
  let itemImagePath = itemName.toString().toLowerCase();
  console.log(itemImagePath);
  const [isRecipeSaved, setIsRecipeSaved] = useState(false);

  console.log('isCallerSavedScreen', isCallerSavedScreen);

  useEffect(() => {
    console.log('Use effect ran');
    checkIfRecipeSaved();
    getRecipeIngredients();
    getDetailedRecipeInformation();
    navigation.setOptions({title: itemName});
    dispatch(MiscActions.showSearchBar(false));
  }, []);

  const checkIfRecipeSaved = () => {
    console.log('userDataInStore in details screen', userDataInStore);
    const x = userDataInStore.recipes.filter(item => {
      if (item.recipeName === itemName) {
        return true;
      }
    });
    console.log('x', x);
    if (x.length > 0) {
      setIsRecipeSaved(true);
    }
  };

  const getRecipeIngredients = async () => {
    let spoonacularKeyObject = await spoonacularApiKey({expired: false});
    let spoonacularKey = spoonacularKeyObject.key;
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${itemId}/ingredientWidget.json?apiKey=${spoonacularKey}`,
    );
    console.log(response);
    if (response.status == 200) {
      setIngredientsFromApi(response.data.ingredients);
    }
    if (response.status == 402) {
      let responseSpoonacularObject = await spoonacularApiKey({
        expired: true,
        id: spoonacularKeyObject.id,
      });
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${itemId}/ingredientWidget.json?apiKey=${
          responseSpoonacularObject.key
        }`,
      );
      console.log(response);
      if (response.status == 200) {
        setIngredientsFromApi(response.data.ingredients);
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'Something went wrong, Please try again !',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
        navigation.navigate('HomeScreen1');
      }
    }
  };

  const getDetailedRecipeInformation = async () => {
    let spoonacularKeyObject = await spoonacularApiKey({expired: false});
    let spoonacularKey = spoonacularKeyObject.key;
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${itemId}/information?apiKey=${spoonacularKey}`,
    );
    console.log(response);
    if (response.status == 200) {
      setRecipeDetailInformation(response.data);
    }
    if (response.status == 402) {
      let responseSpoonacularObject = await spoonacularApiKey({
        expired: true,
        id: spoonacularKeyObject.id,
      });
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${itemId}/ingredientWidget.json?apiKey=${
          responseSpoonacularObject.key
        }`,
      );
      console.log(response);
      if (response.status == 200) {
        setRecipeDetailInformation(response.data);
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'Something went wrong, Please try again !',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
        navigation.navigate('HomeScreen1');
      }
    }
  };

  const renderIngredientTable = () => {
    return (
      ingredientsFromApi && (
        <View
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 20,
          }}>
          <View style={{width: '100%'}}>
            <Table
              borderStyle={{
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 5,
              }}>
              <Row
                data={['Ingredient Name', 'Quantity']}
                style={styles.head}
                textStyle={{margin: 6, fontSize: 17, textAlign: 'center'}}
              />
              {ingredientsFromApi.map((item, index) => {
                return (
                  <Row
                    data={[
                      item.name,
                      item.amount.metric.value + ' ' + item.amount.metric.unit,
                    ]}
                    key={index}
                    style={styles.head}
                    textStyle={{margin: 6, fontSize: 15, textAlign: 'center'}}
                  />
                );
              })}
            </Table>
          </View>
        </View>
      )
    );
  };

  const handleRemove = item => {
    console.log('item', item);
    Alert.alert(
      'Confirmation',
      'Are you sure?',
      [
        {
          text: 'No',
          onPress: () => {},
        },
        {
          text: 'Yes',
          onPress: async () => {
            let data = {
              name: itemName,
            };
            dispatch(UserActions.removeRecipe(data));
            setIsRecipeSaved(false);
            const removeData = {
              userId: userDataInStore._id,
              recipeId: itemId,
            };
            const response = await removeRecipe(removeData);
            console.log('response from remove recipe', response);
          },
        },
      ],
      {cancelable: true},
    );
  };

  const getInstructions = async () => {
    let spoonacularKeyObject = await spoonacularApiKey({expired: false});
    let spoonacularKey = spoonacularKeyObject.key;
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${itemId}/analyzedInstructions?apiKey=${spoonacularKey}`,
    );
    console.log('response', response);
    if (response.status == 200) {
      console.log('response.data[0].steps', response.data[0].steps);
      return response.data[0].steps;
    }
    if (response.status == 402) {
      let responseSpoonacularObject = await spoonacularApiKey({
        expired: true,
        id: spoonacularKeyObject.id,
      });
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${itemId}/analyzedInstructions?apiKey=${
          responseSpoonacularObject.key
        }`,
      );
      console.log(response);
      if (response.status == 200) {
        console.log('response.data[0].steps', response.data[0].steps);
        return response.data[0].steps;
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'Something went wrong, Please try again !',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
        navigation.navigate('HomeScreen1');
      }
    }

    // const response = await axios.get(
    //   `https://api.spoonacular.com/recipes/${itemId}/analyzedInstructions?apiKey=${spoonacularApiKey}`,
    // );
    // console.log('INSTRCTIONS', response);
    // if (response.status === 200) {
    //   console.log('response.data[0].steps', response.data[0].steps);
    //   return response.data[0].steps;
    // }
  };

  const handleSaveRecipe = async () => {
    ToastAndroid.showWithGravityAndOffset(
      'Recipe Saved !',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
    const dbData = {
      recipeId: itemId,
      recipeName: itemName,
      recipeIngredients: ingredientsFromApi,
      imageUrl: itemImage,
    };
    setIsRecipeSaved(true);

    const updateData = await updateUserData(dbData);
    console.log('updated Data', updateData);

    const instructions = await getInstructions();
    const instructionsData = {
      recipeId: itemId,
      recipeInstructions: instructions,
    };
    const resInstructionsData = await updateUserData(instructionsData);
    console.log('resInstructionsData', resInstructionsData);
    // save in store
    const storeData = {
      recipeObject: {
        recipeId: itemId,
        recipeName: itemName,
        recipeArray: dbData.recipeIngredients,
        imageUrl: itemImage,
      },
      instructionsObject: {
        recipeId: itemId,
        instructions: instructionsData.recipeInstructions,
      },
    };
    dispatch(UserActions.addRecipe(storeData));
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.parentContainer}>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          style={{width: '100%'}}>
          <View style={styles.randomRecipeContainer}>
            <Image
              source={{
                uri:
                  itemImage != undefined
                    ? itemImage
                    : recipeDetailInformation && recipeDetailInformation.image,
              }}
              style={{width: '100%', height: 290, borderRadius: 10}}
            />
          </View>
          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {isRecipeSaved ? (
              <View
                style={{
                  width: '100%',
                }}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    backgroundColor: 'red',
                    paddingVertical: 10,
                  }}
                  onPress={() => {
                    handleRemove();
                  }}>
                  <Text
                    style={{textAlign: 'center', color: 'white', fontSize: 17}}>
                    Remove this recipe from saved
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                }}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    backgroundColor: '#1aff8c',
                    paddingVertical: 10,
                  }}
                  onPress={() => handleSaveRecipe()}>
                  <Text
                    style={{textAlign: 'center', color: 'black', fontSize: 17}}>
                    Save this Recipe
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View
              style={{
                width: '100%',
                marginTop: 2,
              }}>
              <TouchableOpacity
                style={{
                  width: '100%',
                  backgroundColor: 'black',
                  paddingVertical: 10,
                }}
                onPress={() => {
                  let data = {
                    name: itemName,
                    id: itemId,
                  };
                  navigation.navigate('RecipeInstructionsScreen', data);
                }}>
                <Text
                  style={{textAlign: 'center', color: 'white', fontSize: 17}}>
                  Read Instructions
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons end */}
          <View
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, marginBottom: 20, marginTop: 20}}>
              List Of Ingredients :
            </Text>
            {renderIngredientTable()}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

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
  flatlistStyle: {marginVertical: 0, marginLeft: 1},
  flatlistParentContainer: {
    height: 'auto',
    width: 190,
    marginBottom: 20,
  },
  flatlistImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
  },
  flatlistTextContainer: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  flatlistText: {
    textAlign: 'center',
    fontSize: 15,
    paddingHorizontal: 5,
  },
  scrollViewContentContainerStyle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewMoreContainer: {
    borderWidth: 2,
    padding: 10,
    marginBottom: 15,
    borderColor: colors.themeColor,
    borderRadius: 20,
  },
  randomRecipeContainer: {
    width: '100%',
    // height: '30%',
    display: 'flex',
    // borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollView: {
    backgroundColor: Colors.lighter,
  },
  container: {
    margin: 0,
    padding: 0,
    height: '45%',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 15,
    textTransform: 'uppercase',
    color: 'yellow',
  },
  nameTile: {
    marginTop: 5,
    backgroundColor: '#8326d0',
    padding: 9,
    borderRadius: 20,
    minWidth: '40%',
    alignItems: 'center',
  },
  priceAndCal: {
    marginTop: 10,
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {
    marginTop: 10,
    paddingLeft: 15,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 65,
  },
  iconPad: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 60,
  },
  saveBtn: {
    height: 20,
    marginTop: 10,
    width: '80%',
  },
  tablecontainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6},
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    // marginBottom: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonRemove: {
    width: '90%',
    backgroundColor: 'red',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonSave: {
    width: '90%',
    backgroundColor: '#1aff8c',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
