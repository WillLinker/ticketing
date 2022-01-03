/*
 * this is loaded on every page.
 *  npm install bootstrap
 *
 * read more:  
 * https://github.com/vercel/next.js/blob/master/errors/css-global.md
 */
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';
/*
 * Component will be either "index.js" or "banana.js" 
 */
const AppComponent = ({ Component, pageProps, currentUser }) => {
  /*
   */
  return <div>
      <Header currentUser={currentUser} />
      <div className='container'>
      <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
};
/*
 * This is only executed during server side rendering.
 */
AppComponent.getInitialProps = async (appContext) => {
  // appContext ==  [ 'AppTree', 'Component', 'router', 'ctx' ]
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser'); 

  let pageProps = {}; 
  if (appContext.Component.getInitialProps) {
    if (!client) {
      console.warn("[AppComponent::getInitialProps] client was null/undefined so I rebuild it!");
      client = buildClient(appContext.ctx);
    }

    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx, 
      client, 
      data.currentUser);

    console.log("###------- _app.js getInitialProps ------------");
    console.log(pageProps);
  }
  //console.log(pageProps);
  return { pageProps, ...data };
};

export default AppComponent;