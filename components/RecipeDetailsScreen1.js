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
  // const [focusCount, setFocusCount] = useState(0);

  console.log('isCallerSavedScreen', isCallerSavedScreen);
  // const isFocused = useIsFocused();

  // if (isFocused) {
  //   console.log('userDataInStore focus', userDataInStore);
  //   userDataInStore.recipes.map(item => {
  //     if (itemId === item.recipeId) {
  //       setIsRecipeSaved(true);
  //     } else {
  //       setIsRecipeSaved(false);
  //     }
  //   });
  // }

  useEffect(() => {
    console.log('Use effect ran');
    checkIfRecipeSaved();
    getRecipeIngredients();
    getDetailedRecipeInformation();
    navigation.setOptions({title: itemName});
    dispatch(MiscActions.showSearchBar(false));
    // dispatch(MiscActions.setIsCallerSavedScreen(false));
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
    if (isCallerSavedScreen === true) {
      console.log('CHAA GAYA');
      const itemIngredients = route.params.ingredients;
      setIngredientsFromApi(itemIngredients);
    } else {
      console.log('NAHI CHAAAYAA');
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${itemId}/ingredientWidget.json?apiKey=${spoonacularApiKey}`,
      );
      console.log(response);
      setIngredientsFromApi(response.data.ingredients);
    }
  };

  const getDetailedRecipeInformation = async () => {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${itemId}/information?apiKey=${spoonacularApiKey}`,
    );
    console.log(response);
    setRecipeDetailInformation(response.data);
  };

  // const translateIngredientToHindi = () => {
  //   console.log('Inside translate');
  //   const ingredientHindi = [...ingredientsFromApi];
  //   ingredientHindi.map(async item => {
  //     const response = await axios.get(
  //       `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${item.name}`,
  //     );
  //     console.log(response);
  //     // console.log(response.data[0]);
  //     // item.name = response[0][0][0];
  //   });
  //   console.log(ingredientHindi);
  // };

  const renderIngredientTable = () => {
    return (
      ingredientsFromApi && (
        <View
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 200,
          }}>
          <View style={{width: '90%'}}>
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
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${itemId}/analyzedInstructions?apiKey=${spoonacularApiKey}`,
    );
    console.log('INSTRCTIONS', response);
    if (response.status === 200) {
      console.log('response.data[0].steps', response.data[0].steps);
      return response.data[0].steps;
    }
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
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#ffeaa7',
        backgroundColor: '#dff9fb',
        paddingBottom: 50,
      }}>
      <View
        style={{
          width: '95%',
          height: '20%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: 120,
        }}>
        <Image
          source={{
            uri:
              itemImage != undefined
                ? itemImage
                : recipeDetailInformation && recipeDetailInformation.image,
          }}
          style={{width: '100%', height: '100%'}}
        />
      </View>

      <View style={styles.buttonContainer}>
        {/* <Button
          onPress={() => translateIngredientToHindi()}
          title="Translate to hindi"
          color="#841584"
        /> */}
        {isRecipeSaved ? (
          <View
            style={{
              width: '90%',
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
              <Text style={{textAlign: 'center', color: 'white', fontSize: 17}}>
                Remove this recipe from saved
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              width: '90%',
            }}>
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: '#1aff8c',
                paddingVertical: 10,
              }}
              onPress={() => handleSaveRecipe()}>
              <Text style={{textAlign: 'center', color: 'black', fontSize: 17}}>
                Save this Recipe
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View
        style={{
          width: '85%',
          marginBottom: 12,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '90%',
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
            <Text style={{textAlign: 'center', color: 'white', fontSize: 17}}>
              Read Instructions
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 20, marginBottom: 20}}>
          List Of Ingredients :
        </Text>
        {renderIngredientTable()}
      </View>
    </ScrollView>
  );
}
const styles = {
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
    width: '85%',
    marginTop: 20,
    marginBottom: 5,
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
};
