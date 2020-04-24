const initState = {
  isCallerSavedScreen: false,
  isLoggedIn: false,
  showLoginScreen: true,
  showSearchBar: false,
};

const miscReducer = (state = initState, action) => {
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

  if (action.type === 'SET_IS_LOGGED_IN') {
    console.log('reducer ka state', state);
    state = {
      ...state,
      isLoggedIn: action.payload,
    };
    console.log('reducer state after saving', state);
    return state;
  }

  if (action.type === 'SHOW_LOGIN_SCREEN') {
    console.log('reducer ka state', state);
    state = {
      ...state,
      showLoginScreen: action.payload,
    };
    console.log('reducer state after saving', state);
    return state;
  }

  if (action.type === 'SHOW_SEARCH_BAR') {
    console.log('reducer ka state', state);
    state = {
      ...state,
      showSearchBar: action.payload,
    };
    console.log('reducer state after saving', state);
    return state;
  }

  return state;
};

export default miscReducer;
