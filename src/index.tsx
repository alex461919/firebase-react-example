import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './mui-theme';
import { firebaseConfig } from './firebaseConfig';
import { SnackbarProvider } from 'notistack';
import { store } from './store';
import { Provider } from 'react-redux';
import { initFirebaseApp } from './firebase';

initFirebaseApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} autoHideDuration={5000} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <CssBaseline />
        <Provider {...{ store }}>
          <App />
        </Provider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
