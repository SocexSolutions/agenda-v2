import Layout       from "../components/Layout";
import { Provider } from "react-redux";
import { useStore } from "../store/store";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const store = useStore({});

  return (
    <Provider store={store}>
      <Layout>
        <Component store={store} {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
