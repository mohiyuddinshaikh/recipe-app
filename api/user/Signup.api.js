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

    // console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    console.log(error.status);

    return error.response;
  }
};

export const loginApi = async data => {
  try {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlODQ0NWI1ZWJmMjQ2MTQyOGNhMDRmMiIsImlhdCI6MTU4NTcyODk1NCwiZXhwIjoxNTg1NzcyMTU0fQ.J72CcvmDewpaG9X0YxHFMJ7bfDOfLKTB5dU3qFqwbOM';
    console.log(data);
    const url = `${baseUrl}/login`;
    console.log(QueryString.stringify(data));
    const response = await axios.post(url, QueryString.stringify(data));

    // console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    console.log(error.status);

    return error.response;
  }
};
