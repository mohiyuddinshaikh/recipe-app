//API
import axios from 'axios';
import {baseUrl} from '../../assets/constants/baseUrl';
import QueryString from 'query-string';
import {getAuthToken} from '../storage/storage';

export const getUserData = async () => {
  try {
    const url = `${baseUrl}/getuser`;
    console.log('url', url);
    const token = await getAuthToken();
    console.log('Yaha ka token', token);
    const response = await axios.get(url, {
      headers: {
        authtoken: token,
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    console.log(error.status);

    return error.response;
  }
};

export const updateUserData = async data => {
  try {
    const url = `${baseUrl}/updateuser`;
    console.log('url', url);
    const token = await getAuthToken();
    console.log('updateUserData', data);
    console.log('Yaha ka token', token);
    const response = await axios.patch(url, data, {
      headers: {
        authtoken: token,
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log('update error', error);
  }
};

export const removeRecipe = async data => {
  try {
    const url = `${baseUrl}/removerecipe`;
    console.log('url', url);
    const token = await getAuthToken();
    console.log('remove recipe data', data);
    console.log('remove recipe token', token);
    const response = await axios.patch(url, data, {
      headers: {
        authtoken: token,
      },
    });
    console.log('remove recipe api response', response);
    return response;
  } catch (error) {
    console.log('Remove recipe error', error);
  }
};
