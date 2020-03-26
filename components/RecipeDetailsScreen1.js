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
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../store/actions/SaveAction';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import spoonacularApiKey from '../assets/constants/SpoonacularApiKey';
import {Table, Row, Rows} from 'react-native-table-component';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function RecipeDetailsScreen1({route}) {
  const dispatch = useDispatch();
  const recipeDataInStore = useSelector(state => state.recipes);
  const [ingredientsFromApi, setIngredientsFromApi] = useState();
  console.log(route.params);
  console.log('route', route);
  const itemName = route.params.name;
  const itemId = route.params.itemId;
  const itemImage = route.params.imageUrl;
  const itemCalories = route.params.calories;
  const itemPrice = route.params.price;
  const itemDescription = route.params.description;
  const itemIngrediants = route.params.ingrediants;
  let itemImagePath = itemName.toString().toLowerCase();
  console.log(itemImagePath);
  const [isRecipeSaved, setIsRecipeSaved] = useState(false);

  useEffect(() => {
    checkIfRecipeSaved();
    getRecipeIngredients();
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
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${itemId}/ingredientWidget.json?apiKey=${spoonacularApiKey}`,
    );
    console.log(response);
    setIngredientsFromApi(response.data.ingredients);
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

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffeaa7',
      }}>
      <View
        style={{
          width: '95%',
          height: '20%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: 150,
        }}>
        <Image
          source={{uri: itemImage}}
          style={{width: '100%', height: '100%', marginTop: 14}}
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
            <Icon name="tachometer" color="green" size={30} />
            <Text style={{color: 'green'}}>{itemCalories}</Text>
          </View>
          <View style={styles.iconPad}>
            <Icon name="money" size={30} color="red" />
            <Text style={{color: 'red'}}>{itemPrice}</Text>
          </View>
        </View> */}

      <View
        style={{
          width: '85%',
          margin: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {isRecipeSaved ? (
          // <Button
          //   color="red"
          //   title="Remove this recipe from saved"
          //   onPress={() => {
          //     let data = {
          //       name: itemName,
          //     };
          //     dispatch(Actions.removeRecipe(data));
          //     setIsRecipeSaved(false);
          //     alert('Recipe removed from saved tab!');
          //   }}
          // />
          <View
            style={{
              width: '90%',
              backgroundColor: 'red',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                let data = {
                  name: itemName,
                };
                dispatch(Actions.removeRecipe(data));
                alert('Recipe removed from saved tab!');
                setIsRecipeSaved(false);
              }}>
              <Text style={{color: 'white', padding: 10, fontSize: 17}}>
                Remove this recipe from saved
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              width: '90%',
              backgroundColor: '#1aff8c',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                let data = {
                  name: itemName,
                  calories: itemCalories,
                };
                alert('Recipe saved in saved tab!');
                setIsRecipeSaved(true);
                dispatch(Actions.saveRecipe(data));
              }}>
              <Text style={{color: 'black', padding: 10, fontSize: 17}}>
                Save this Recipe
              </Text>
            </TouchableOpacity>
          </View>

          // <Button
          //   color="#1aff8c"
          //   titleColor="black"
          //   title="Save this Recipe"
          //   onPress={() => {
          //     let data = {
          //       name: itemName,
          //       calories: itemCalories,
          //     };
          //     setIsRecipeSaved(true);
          //     dispatch(Actions.saveRecipe(data));
          //     alert('Recipe saved in saved tab!');
          //   }}
          // />
        )}
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
        {/* <ScrollView contentInsetAdjustmentBehavior="automatic"> */}
        {renderIngredientTable()}
        {/* </ScrollView> */}
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
};
