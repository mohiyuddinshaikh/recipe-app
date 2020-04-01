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
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import spoonacularApiKey from '../assets/constants/SpoonacularApiKey';
import {Table, Row, Rows} from 'react-native-table-component';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function RecipeDetailsScreen1({navigation, route}) {
  const dispatch = useDispatch();
  const recipeDataInStore = useSelector(state => state.saveReducer.recipes);
  const isCallerSavedScreen = useSelector(
    state => state.miscReducer.isCallerSavedScreen,
  );
  const [ingredientsFromApi, setIngredientsFromApi] = useState();
  console.log(route.params);
  console.log('route', route);
  const itemName = route.params.name;
  const itemId = route.params.itemId;
  const itemImage = route.params.imageUrl;
  let itemImagePath = itemName.toString().toLowerCase();
  console.log(itemImagePath);
  const [isRecipeSaved, setIsRecipeSaved] = useState(false);

  console.log('isCallerSavedScreen', isCallerSavedScreen);

  useEffect(() => {
    checkIfRecipeSaved();
    getRecipeIngredients();
    navigation.setOptions({title: itemName});
    dispatch(MiscActions.setIsCallerSavedScreen(false));
  }, []);

  const checkIfRecipeSaved = () => {
    const x = recipeDataInStore.filter(item => {
      if (item.name === itemName) {
        return true;
      }
    });
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
          onPress: () => {
            let data = {
              name: itemName,
            };
            dispatch(Actions.removeRecipe(data));
            setIsRecipeSaved(false);
          },
        },
      ],
      {cancelable: true},
    );
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
          source={{uri: itemImage}}
          style={{width: '100%', height: '100%'}}
        />
      </View>

      {/* <View style={styles.nameTile}> */}
      {/* <Text>{itemName}</Text> */}
      {/* </View> */}

      {/* <View style={styles.description}>
          <Text>{itemDescription}</Text>
        </View>

        <View style={styles.stats}>
         
          <View style={styles.iconPad}>
            <Icon name="money" size={30} color="red" />
            <Text style={{color: 'red'}}>{itemPrice}</Text>
          </View>
        </View> */}

      <View style={styles.buttonContainer}>
        {/* <Button
          onPress={() => translateIngredientToHindi()}
          title="Translate to hindi"
          color="#841584"
        /> */}
        {isRecipeSaved ? (
          <View style={styles.ctaButtonRemove}>
            <TouchableOpacity
              onPress={() => {
                handleRemove();
              }}>
              <Text style={{color: 'white', padding: 10, fontSize: 17}}>
                Remove this recipe from saved
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ctaButtonSave}>
            <TouchableOpacity
              onPress={() => {
                let data = {
                  name: itemName,
                  id: itemId,
                  imageUrl: itemImage,
                  ingredients: ingredientsFromApi,
                };
                ToastAndroid.showWithGravityAndOffset(
                  'Recipe Saved !',
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
                setIsRecipeSaved(true);
                dispatch(Actions.saveRecipe(data));
              }}>
              <Text style={{color: 'black', padding: 10, fontSize: 17}}>
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
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              let data = {
                name: itemName,
                id: itemId,
              };
              navigation.navigate('RecipeInstructionsScreen', data);
            }}>
            <Text style={{color: 'white', padding: 10, fontSize: 17}}>
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
