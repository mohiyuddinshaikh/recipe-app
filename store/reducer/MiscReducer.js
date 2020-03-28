const initState = {
  isCallerSavedScreen: false,
};

const setIsCallerSavedScreen = (state = initState, action) => {
  console.log(action.data);
  console.log(action);
  console.log('INSIDE MISC REDUCER');

  if (action.type === 'SET_IS_CALLER_SAVED_SCREEN') {
    console.log('reducer ka state', state);
    state = {
      isCallerSavedScreen: action.payload,
    };
    console.log('reducer state after saving', state);
    return state;
  }

  return state;
};

export default setIsCallerSavedScreen;
