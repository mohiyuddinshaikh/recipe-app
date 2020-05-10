import {Alert} from 'react-native';

const alertComponent = props => {
  console.log('props :>> ', props);
  return Alert.alert(
    'Alert',
    props.subheading,
    [
      {
        text: 'Ok',
        onPress: () => {},
      },
    ],
    {cancelable: true},
  );
};

export default alertComponent;
