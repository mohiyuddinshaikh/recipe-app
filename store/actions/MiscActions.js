const SET_IS_CALLER_SAVED_SCREEN = 'SET_IS_CALLER_SAVED_SCREEN';
const SET_IS_LOGGED_IN = 'SET_IS_LOGGED_IN';
const SHOW_LOGIN_SCREEN = 'SHOW_LOGIN_SCREEN';

export function setIsCallerSavedScreen(data) {
  console.log('INSIDE MISC ACTION');

  return {
    type: SET_IS_CALLER_SAVED_SCREEN,
    payload: data,
  };
}

export function setIsLoggedIn(data) {
  return {
    type: SET_IS_LOGGED_IN,
    payload: data,
  };
}

export function showLoginScreen(data) {
  return {
    type: SHOW_LOGIN_SCREEN,
    payload: data,
  };
}
