const initState = {
  user: null,
};

const userReducer = (state = initState, action) => {
  console.log(action);
  console.log('INSIDE USERRRR REDUCER');

  if (action.type === 'GET_USER') {
    console.log('payload ka data', action.payload);
    console.log('reducer ka state', state);
    return state;
  }

  if (action.type === 'UPDATE_USER_DATA') {
    console.log('payload ka data', action.payload);
    console.log('reducer ka state', state);
    state = {
      user: {...action.payload},
    };
    return state;
  }

  if (action.type === 'REMOVE_RECIPE') {
    console.log('remove recipe payload data', action.payload);
    console.log('remove recipe reducer state', state);
    const userId = action.payload.userId;
    const recipeId = action.payload.recipeId;
    // remove ingredients
    let removeIngredientsArray = [];
    let removeInstructionsArray = [];
    state.user.recipes.map((item, index) => {
      if (item.recipeId === recipeId) {
        let arr = [...state.user.recipes];
        arr.splice(index, 1);
        removeIngredientsArray = [...arr];
      }
    });
    // remove instructions
    state.user.instructions.map((item, index) => {
      if (item.recipeId === recipeId) {
        let arr = [...state.user.instructions];
        arr.splice(index, 1);
        removeInstructionsArray = [...arr];
      }
    });

    state = {
      user: {
        recipes: removeIngredientsArray,
        instructions: removeInstructionsArray,
      },
    };
    return state;
  }

  if (action.type === 'ADD_RECIPE') {
    console.log('add recipe payload data', action.payload);
    console.log('add recipe reducer state', state);
    // const recipe = action.payload.recipe;
    // const instructions = action.payload.instructions;
    const recipe = action.payload.recipeObject;
    const instructions = action.payload.instructionsObject;
    state = {
      user: {
        ...state.user,
        recipes: [...state.user.recipes, recipe],
        instructions: [...state.user.instructions, instructions],
      },
    };
    console.log('add recipe reducer after update', state);
    return state;
  }

  return state;
};

export default userReducer;
