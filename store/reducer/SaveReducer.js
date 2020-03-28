const initState = {
  recipes: [],
};

const saveReducer = (state = initState, action) => {
  console.log(action.data);
  console.log(action);

  if (action.type === 'SAVE_RECIPE') {
    console.log('payload ka data', action.payload);
    console.log('reducer ka state', state);
    state = {
      recipes: [...state.recipes, action.payload],
    };
    console.log('reducer state after saving', state);
    return state;
  }

  if (action.type === 'REMOVE_RECIPE') {
    console.log('payload ka data', action.payload);
    console.log('remove recipe reducer state', state);
    const filteredArray = state.recipes.filter(item =>
      item.name !== action.payload.name ? item.name : null,
    );
    console.log('filteredArray', filteredArray);
    state = {
      recipes: [...filteredArray],
    };
    console.log('state after filter array operation', state);
    return state;
  }

  return state;
};

export default saveReducer;
