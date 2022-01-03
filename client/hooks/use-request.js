import axios from "axios";
import { useState } from 'react';

export default ({url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {

    try {
      setErrors(null);
      console.log("[doRequest::log] " + url);
      const response = await axios[method](url, { ...body, ...props });

      if(onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    }
    catch(err) {
      console.error(err);
      setErrors(
        <div className='alerts alert-danger'>
          <h4>Errors</h4>
          <ul className='my-0'>
          {err.response && err.response.data.map(err => (
            <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return {doRequest, errors};
};