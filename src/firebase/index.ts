import firebase from 'firebase/compat/app';
import { initAuth } from './auth';
import { initMessagingObserver } from './messaging';
import { senderRegister } from './sender';

export interface Visitor extends firebase.UserInfo {
  signIn_at: number | null;
  refresh_at: number | null;
  fcmToken: string | null;
  fcmTokenRefresh_at: number | null;
}

export const initFirebaseApp = (firebaseConfig: Object) => {
  firebase.initializeApp(firebaseConfig);
  initMessagingObserver();
  initAuth();
  senderRegister();
};
