import axios from 'axios';
import spoonacularApiKey from '../../assets/constants/SpoonacularApiKey';

const getUrl = props => {
  if (props.data.category == 0) {
    return `https://api.spoonacular.com/recipes/random?apiKey=${
      props.spoonacularKey
    }&number=1`;
  }
  if (props.data.category == 1) {
    return `https://api.spoonacular.com/recipes/search?apiKey=${
      props.spoonacularKey
    }&query=${props.foodItem}&number=${props.numberOfResults}&offset=${
      props.offset
    }&instructionsRequired=true`;
  }
  if (props.data.category == 2) {
    return `https://api.spoonacular.com/recipes/search?apiKey=${
      props.spoonacularKey
    }&number=${props.numberOfResults}&offset=${props.offset}&type=${
      props.data.identifier
    }&instructionsRequired=true`;
  }
  if (props.data.category == 3) {
    return `https://api.spoonacular.com/recipes/search?apiKey=${
      props.spoonacularKey
    }&query=${props.foodItem}&number=${props.numberOfResults}&offset=${
      props.offset
    }&instructionsRequired=true`;
  }
  if (props.data.category == 4) {
    return `https://api.spoonacular.com/recipes/search?apiKey=${
      props.spoonacularKey
    }&number=${props.numberOfResults}&offset=${props.offset}&cuisine=${
      props.data.identifier
    }&instructionsRequired=true`;
  }
};

const getRecursionStatus = props => {
  console.log('RecursionStatusKeProps :>> ', props);
  if (props.hasOwnProperty('hasExpired')) {
    return {hasExpired: true, keyId: props.hasExpired};
  } else return {hasExpired: false};
};

const getRecipeFromApi = async props => {
  console.log('props :>> ', props);
  let viewMoreCount = props.viewMoreCount;
  let recursionCall = await getRecursionStatus(props);
  let spoonacularKeyObject =
    recursionCall.hasExpired == false
      ? await spoonacularApiKey({expired: false})
      : await spoonacularApiKey({expired: true, id: props.hasExpired});
  let spoonacularKey = spoonacularKeyObject.key;
  console.log('viewMoreCount :>> ', viewMoreCount);
  console.log('props :>> ', props);
  const foodItem = props.data.identifier;
  const numberOfResults = '10';
  let offset = viewMoreCount * 11 + 1;
  console.log('offset :>> ', offset);
  const url = getUrl({
    ...props,
    foodItem,
    numberOfResults,
    offset,
    spoonacularKey,
  });
  const response = await axios.get(url);
  console.log(response);
  if (response.status == 200) {
    return response;
  }
  if (response.status == 402) {
    //   hasExpired works for two things, 1: Its presence indicate that the value is under recursion, and 2: Its value is the id of the key which was expired.
    getRecipeFromApi({...props, hasExpired: spoonacularKeyObject.id});
    console.log('response :>> ', response);
  }
};

export default getRecipeFromApi;
