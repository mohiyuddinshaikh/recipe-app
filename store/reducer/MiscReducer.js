const initState = {
  isCallerSavedScreen: false,
  isLoggedIn: false,
  showLoginScreen: true,
  showSearchBar: false,
  viewMoreCount: 0,
  isSavedScreenActive: false,
  spoonacularKeyIndex: 0,
};

const miscReducer = (state = initState, action) => {
  console.log(action.data);
  console.log(action);

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

  if (action.type === 'SET_VIEW_MORE_COUNT') {
    console.log('reducer ka state', state);
    state = {
      ...state,
      viewMoreCount: action.payload,
    };
    console.log('reducer state after saving', state);
    return state;
  }

  if (action.type === 'SAVED_SCREEN_ACTIVE') {
    console.log('reducer ka state', state);
    state = {
      ...state,
      isSavedScreenActive: action.payload,
    };
    console.log('reducer state after saving', state);
    return state;
  }

  if (action.type === 'SPOONACULAR_KEY_INDEX') {
    state = {
      ...state,
      spoonacularKeyIndex: state.spoonacularKeyIndex + 1,
    };
    console.log('reducer state after saving', state);

    return state;
  }

  if (action.type === 'RESET_SPOONACULAR_KEY_INDEX') {
    state = {
      ...state,
      spoonacularKeyIndex: 0,
    };
    console.log('reducer state after saving', state);

    return state;
  }

  return state;
};

export default miscReducer;
