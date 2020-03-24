const SAVE_RECIPE = 'SAVE_RECIPE';

export function saveRecipe(data) {
  return {
    type: SAVE_RECIPE,
    payload: data,
  };
}
