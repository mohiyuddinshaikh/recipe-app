const GET_USER = 'GET_USER';
const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
const REMOVE_RECIPE = 'REMOVE_RECIPE';
const ADD_RECIPE = 'ADD_RECIPE';

export function getUser() {
  console.log('Inside get user action');
  return {
    type: GET_USER,
    // payload: data,
  };
}

export function updateUser(data) {
  console.log('update user data', data);
  return {
    type: UPDATE_USER_DATA,
    payload: data,
  };
}

export function removeRecipe(data) {
  console.log('remove recipe data', data);
  return {
    type: REMOVE_RECIPE,
    payload: data,
  };
}

export function addRecipe(data) {
  console.log('add recipe data', data);
  return {
    type: ADD_RECIPE,
    payload: data,
  };
}
