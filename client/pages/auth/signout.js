import Router from 'next/router';
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

export default () => {

  // const { doRequest } = userRequest({
  //   url: '/api/users/signout',
  //   method: 'post',
  //   body: {},
  //   onSuccess: () => {
  //     Router.push("/");
  //   }
  // });

  const {doRequest, errors} = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: { },
    onSuccess: () => {
      Router.push("/");
    }
});

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out....</div>
};