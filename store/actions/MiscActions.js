const SET_IS_CALLER_SAVED_SCREEN = 'SET_IS_CALLER_SAVED_SCREEN';

export function setIsCallerSavedScreen(data) {
  console.log('INSIDE MISC ACTION');

  return {
    type: SET_IS_CALLER_SAVED_SCREEN,
    payload: data,
  };
}
