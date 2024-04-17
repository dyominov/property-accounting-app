'use client';
import { Provider } from 'react-redux';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { SessionProvider } from 'next-auth/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { createEmotionCache } from '@/utils/create-emotion-cache';
import { registerChartJs } from '@/utils/register-chart-js';
import { theme } from '../theme';
import { wrapper } from '@/store/store';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import uk from 'date-fns/locale/uk';

registerChartJs();
fetch(`http://localhost:3000/api/init-db`)
  .then(() => { })
  .catch((error) => console.log(error));

const clientSideEmotionCache = createEmotionCache();

const App = ({ Component, emotionCache = clientSideEmotionCache, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  
  process.title = 'propertyAccountingApp';

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>
            Облік Майна
          </title>
          <meta
            name="viewport"
            content="initial-scale=1, width=device-width"
          />
        </Head>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarProvider autoHideDuration={1_700} maxSnack={15} preventDuplicate={true}>

                {getLayout(<Component {...pageProps} />)}
              </SnackbarProvider>
            </ThemeProvider>
          </Provider>

        </LocalizationProvider>
      </CacheProvider>
    </SessionProvider>
  );
};

export default App;
