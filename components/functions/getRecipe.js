// Get recipe from API 2

import axios from 'axios';
import getSpoonacularApiKey from '../../assets/constants/Spoon';

// Categories description
// Category 0 : Random Recipe
// Category 1 : ItemSpecificCategory : Chicken,Paneer
// Category 2 : MealSpecificCategory : Breakfast, Lunch, Snack, Soup, Dessert,
// Category 3 : FoodSpecificCategory : Biryani, Pizza
// Category 4 : Cuisine
// Category 5 : Recipe Details Screen - Ingredients.
// Category 6 : Recipe Details Screen - Instructions

export default async function getRecipe(props) {
  try {
    console.log('props :>> ', props);
    console.log('I am being hit');
    // const viewMoreCount = props.category != 0 ? props.viewMoreCount : null;
    const viewMoreCount =
      props.category == 0 || props.category == 5 || props.category == 6
        ? null
        : props.viewMoreCount;

    const foodItem =
      props.category == 0 || props.category == 5 || props.category == 6
        ? null
        : props.data.identifier;
    const numberOfResults = '10';
    let offset = viewMoreCount * 11 + 1;
    console.log('offset :>> ', offset);
    const res = getSpoonacularApiKey(props.spoonacularKeyIndex); // this line calls Spoon.js file and grabs a key object from there with index 0.
    console.log('res :>> ', res);
    let apiKey = res.keyObject.key;
    let data = {...props};
    let dataToSend = {
      // data,
      ...props,
      foodItem,
      numberOfResults,
      offset,
      apiKey,
    };
    console.log('dataToSend :>> ', dataToSend);
    let url = getUrl(dataToSend);
    console.log('url :>> ', url);
    // let url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1`;
    const response = await axios.get(url);
    // above line will call spoonacular api if response is 200 we send the data back to caller.
    // but if response is 402 means the points from this key are exhausted and we need to re-call the same API with different key
    console.log('responseyo :>> ', response);
    if (response.status == 200) {
      return {response};
    }
    if (response.status == 402) {
      // response 402 means the api key points are exhausted.
      const response = await ifPointsExhausted(props);
      return response;
    }
  } catch (error) {
    console.log('error :>> ', error);
    console.log('error.response :>> ', error.response);
    if (error.response.status == 402) {
      // response 402 means the api key points are exhausted.
      const response = await ifPointsExhausted(props);
      return response;
    }
  }
}

const ifPointsExhausted = async props => {
  const resIn402 = await getSpoonacularApiKey(props.spoonacularKeyIndex + 1);
  console.log('resIn402 :>> ', resIn402);
  // above line will go to Spoon file and grab the next key.
  const callback = await recursion(resIn402, props);
  console.log('callback :>> ', callback);
  return callback;
};

const recursion = async (resIn402, props) => {
  console.log('props :>> ', props);
  if (resIn402.status == 200) {
    // meaning you found key in the Spoon file.
    let apiKey = resIn402.keyObject.key;
    const viewMoreCount =
      props.category == 0 || props.category == 5 || props.category == 6
        ? null
        : props.viewMoreCount;
    const foodItem =
      props.category == 0 || props.category == 5 || props.category == 6
        ? null
        : props.data.identifier;
    const numberOfResults = '10';
    let offset = viewMoreCount * 11 + 1;
    console.log('offset :>> ', offset);
    let url = getUrl({
      ...props,
      foodItem,
      numberOfResults,
      offset,
      apiKey,
    });
    console.log('url :>> ', url);
    // let url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1`;
    const response = await axios.get(url);
    console.log('response :>> ', response);
    if (response.status == 200) {
      // means there are points in the key, so send the response back to callback variable
      return {response, didIncrement: true};
    } else if (response.status == 402) {
      // means points are exhausted for this key as well.
      //  so call if points exhausted again.
      ifPointsExhausted(props);
    }
  } else if (resIn402.status == 403) {
    // all the points from all the keys are exhausted
    alert(resIn402.message);
  } else {
    // Maybe internet or some error nothing related to us.
    alert('Unknown error occured');
  }
};

const getUrl = props => {
  console.log('GETURL props :>> ', props);
  if (props.category == 0) {
    return `https://api.spoonacular.com/recipes/random?apiKey=${
      props.apiKey
    }&number=1`;
  }
  if (props.category == 5) {
    return `https://api.spoonacular.com/recipes/${
      props.itemId
    }/ingredientWidget.json?apiKey=${props.apiKey}`;
  }
  if (props.category == 6) {
    return `https://api.spoonacular.com/recipes/${
      props.itemId
    }/analyzedInstructions?apiKey=${props.apiKey}`;
  }
  if (props.data.category == 1) {
    return `https://api.spoonacular.com/recipes/search?apiKey=${
      props.apiKey
    }&query=${props.foodItem}&number=${props.numberOfResults}&offset=${
      props.offset
    }&instructionsRequired=true`;
  }
  if (props.data.category == 2) {
    return `https://api.spoonacular.com/recipes/search?apiKey=${
      props.apiKey
    }&number=${props.numberOfResults}&offset=${props.offset}&type=${
      props.data.identifier
    }&instructionsRequired=true`;
  }
  if (props.data.category == 3) {
    return `https://api.spoonacular.com/recipes/search?apiKey=${
      props.apiKey
    }&query=${props.foodItem}&number=${props.numberOfResults}&offset=${
      props.offset
    }&instructionsRequired=true`;
  }
  if (props.data.category == 4) {
    return `https://api.spoonacular.com/recipes/search?apiKey=${
      props.apiKey
    }&number=${props.numberOfResults}&offset=${props.offset}&cuisine=${
      props.data.identifier
    }&instructionsRequired=true`;
  }
};
