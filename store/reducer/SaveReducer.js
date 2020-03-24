const initState = {
  recipes: [],
};

const saveReducer = (state = initState, action) => {
  console.log(action.data);
  console.log(action);

  if (action.type === 'SAVE_RECIPE') {
    // let newPosts = state.posts.push(action.data);
    console.log(state);
    state = {
      recipes: [...state.recipes, action.payload],
    };
    console.log('state', state);
    return state;
  }
  return state;
};

export default saveReducer;
