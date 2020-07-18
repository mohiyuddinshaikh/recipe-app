import axios from 'axios';
import {cloudinaryImageUploadUrl} from '../../assets/constants/cloudinary';

export const uploadImage = async data => {
  try {
    console.log(data);
    const url = cloudinaryImageUploadUrl;
    console.log('url', url);
    const response = await axios.post(url, data);
    console.log('response :>> ', response);
    return response;
  } catch (error) {
    console.log(error);
    console.log(error.status);

    return error.response;
  }
};
