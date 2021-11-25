import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/messaging';
import { serverTimestamp } from 'firebase/firestore';
import { vapidKey } from '../firebaseConfig';

import { BaseMessage } from './sender';
import { store } from '../store';

let previousAuth = false;

export const initMessagingObserver = () => {
  store.subscribe(() => {
    const authResult = store.getState().authResultReducer.value?.user;
    if (authResult && !previousAuth) {
      setTimeout(
        () =>
          firebase
            .messaging()
            .getToken({ vapidKey })
            .then((token) => {
              if (token) {
                saveFCMTokenOnServer(authResult, token);
                console.log(token);
              } else {
                saveFCMTokenOnServer(authResult, null);
                console.log('No registration token available. Request permission to generate one.');
              }
            })
            .catch((err) => {
              console.log('An error occurred while retrieving token. ', err);
            }),
        2000,
      );
    }
    previousAuth = !!authResult;
  });
};

export const useMessage = (): BaseMessage | null => {
  const [message, setMessage] = useState<BaseMessage | null>(null);
  useEffect(() => firebase.messaging().onMessage(setMessage), []);
  return message;
};

const broadcast = new BroadcastChannel('incoming-background-message');

export const useBackgroundMessage = (): BaseMessage | null => {
  const [message, setMessage] = useState<BaseMessage | null>(null);
  useEffect(() => {
    broadcast.onmessage = (event) => {
      console.log('message from service-worker:', event.data);
      setMessage(event.data);
    };
    return () => broadcast.close();
  }, []);
  return message;
};

const saveFCMTokenOnServer = (user: firebase.User, token: string | null) => {
  firebase
    .firestore()
    .collection('/lastAuth/')
    .doc(user.uid)
    .set({ fcm_token: token, fcm_token_refresh_at: serverTimestamp() }, { merge: true })
    .catch((error) => {
      console.log('saveFCMToken error: ', error);
    });
};
