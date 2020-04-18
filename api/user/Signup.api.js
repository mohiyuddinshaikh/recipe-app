//API
import axios from 'axios';
import {baseUrl} from '../../assets/constants/baseUrl';
import QueryString from 'query-string';

export const signupApi = async data => {
  try {
    console.log(data);
    const url = `${baseUrl}/signup`;
    console.log('url', url);
    console.log(QueryString.stringify(data));
    const response = await axios.post(url, QueryString.stringify(data));

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    console.log(error.status);

    return error.response;
  }
};

export const loginApi = async data => {
  try {
    console.log('Login api hit');
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlODQ0NWI1ZWJmMjQ2MTQyOGNhMDRmMiIsImlhdCI6MTU4NTcyODk1NCwiZXhwIjoxNTg1NzcyMTU0fQ.J72CcvmDewpaG9X0YxHFMJ7bfDOfLKTB5dU3qFqwbOM';
    console.log(data);
    const url = `${baseUrl}/login`;
    console.log('url', url);
    console.log(QueryString.stringify(data));
    const response = await axios.post(url, QueryString.stringify(data));

    console.log('login api ka returened data', response);
    return response;
  } catch (error) {
    console.log(error);
    console.log(error.status);

    return error.response;
  }
};

export const checkTokenValidApi = async token => {
  try {
    const url = `${baseUrl}/isTokenValid`;
    console.log('url', url);

    console.log('passed token', token);
    const response = await axios.get(url, {
      headers: {
        authtoken: token,
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: 'Token expired',
      message2: error,
    };
  }
};

export const issueNewToken = async id => {
  try {
    const url = `${baseUrl}/token`;
    console.log('id', id);

    const response = await axios.post(url, id);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
