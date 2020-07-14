import {useDispatch, useSelector} from 'react-redux';

const keyList = [
  {
    id: 0,
    key: 'baa80ca4dd1240238a3e87566c13c94f',
    // mohiyuddin.shaikh46
  },
  {
    id: 1,
    key: 'eaf53e82921f45679b536bb891e3fffd',
    // mohiuddin.shaikh46
  },
  {
    id: 2,
    key: '873f584c8f904a0f88e65b974d4ebb88',
    //  s
  },
  {
    id: 3,
    key: 'ec18f590f29a4c54b3da8d339e06b79d',
    // p
  },
];

const getSpoonacularApiKey = spoonacularKeyIndex => {
  console.log('currentKey :>> ', spoonacularKeyIndex);
  const resultKey = keyList.filter(item => {
    if (item.id == spoonacularKeyIndex) {
      return item.key;
    }
  });
  if (resultKey.length == 0) {
    return {status: 403, message: 'All keys exhausted'};
  } else {
    return {
      status: 200,
      keyObject: resultKey[0],
    };
  }
};

export default getSpoonacularApiKey;
