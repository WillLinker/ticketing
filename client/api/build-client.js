import axios from "axios";

export default({req}) => {

  if (typeof window === 'undefined') {
    // This is used for server side request in Kubernetes
    return axios.create({
      baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers
    });
  }
  else {
    // This is used for browser request
    return axios.create({
      baseURL: "/"
      });
  }
};