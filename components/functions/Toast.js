import {ToastAndroid} from 'react-native';

const toastComponent = props => {
  console.log('props :>> ', props);
  const defaultText = 'Action Successful';
  return ToastAndroid.showWithGravityAndOffset(
    props.message ? props.message : defaultText,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};

export default toastComponent;
