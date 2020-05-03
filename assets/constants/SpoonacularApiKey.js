// const spoonacularApiKey = 'baa80ca4dd1240238a3e87566c13c94f';
// export default spoonacularApiKey;

// const spoonacularApiKey2="eaf53e82921f45679b536bb891e3fffd"
// const spoonacularApiKey3="873f584c8f904a0f88e65b974d4ebb88"

const keyList = [
  {
    id: 0,
    key: 'baa80ca4dd1240238a3e87566c13c94f',
  },
  {
    id: 1,
    key: 'eaf53e82921f45679b536bb891e3fffd',
  },
  {
    id: 2,
    key: '873f584c8f904a0f88e65b974d4ebb88',
  },
  {
    id: 3,
    key: 'ec18f590f29a4c54b3da8d339e06b79d',
  },
];

const spoonacularApiKey = props => {
  console.log('props in apoonacular :>> ', props);
  if (props.expired == true) {
    if (keyList.length - 1 == props.id) {
      // Means all the keys' points are exhausted.
      return keyList[0];
    } else {
      return keyList[props.id + 1];
    }
  } else {
    return keyList[0];
  }
};

export default spoonacularApiKey;
