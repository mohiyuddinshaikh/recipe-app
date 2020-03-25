const SAVE_RECIPE = 'SAVE_RECIPE';
const REMOVE_RECIPE = 'REMOVE_RECIPE';

export function saveRecipe(data) {
  return {
    type: SAVE_RECIPE,
    payload: data,
  };
}

export function removeRecipe(data) {
  console.log('remove data ka data', data);
  return {
    type: REMOVE_RECIPE,
    payload: data,
  };
}
