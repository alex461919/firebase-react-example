import firebase from 'firebase/compat/app';
import { initAuth } from './auth';
import { initMessagingObserver } from './messaging';
import { senderRegister } from './sender';

export interface Visitor extends firebase.UserInfo {
  last_signin_at: number | null;
  last_refresh_at: number | null;
  fcm_token: string | null;
  fcm_token_refresh_at: number | null;
}

export const initFirebaseApp = (firebaseConfig: Object) => {
  firebase.initializeApp(firebaseConfig);
  initMessagingObserver();
  initAuth();
  senderRegister();
};
