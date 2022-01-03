/*
 * This is used to tell NextJS to watch for file changes every 300 milliseconds, this
 * is needed when running in Docker.  
 * 
 * force the pod to restart.
 *     kubectl get pods
 *     kubectl delete pod client......
 *     kubectl get pods
 */
module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  }
};

