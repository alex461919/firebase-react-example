import firebase from 'firebase/compat/app';
import { serverTimestamp } from 'firebase/firestore';
import { signInSuccessObserver } from './firebaseuiWidget';
import { store, setAuthResult, clearAuthResult, useAppSelector } from '../store';

let refreshInterval: NodeJS.Timeout | null = null;
let emailVerifyInterval: NodeJS.Timeout | null = null;

const useAuthResult = () => useAppSelector((state) => state.authResultReducer).value;

export const useCurrentUser = (): firebase.User | null => {
  const authResult = useAuthResult();
  return authResult?.user || null;
};

export const useProviderID = (): string | null => {
  const authResult = useAuthResult();
  return authResult?.additionalUserInfo?.providerId || null;
};

export const useNeedEmailVerified = (): boolean => {
  const authResult = useAuthResult();
  return needEmailVerified(authResult);
};

export const initAuth = () => {
  signInSuccessObserver.onSignInSuccess((authResult) => {
    clearAllInterval();
    refreshInterval = setInterval(() => refreshAuthOnServer(authResult), 30000);
    if (needEmailVerified(authResult)) {
      emailVerifyInterval = setInterval(
        () =>
          firebase
            .auth()
            .currentUser?.reload()
            .then(() => {
              const user = firebase.auth().currentUser;
              if (user?.emailVerified) {
                clearEmailVerifyInterval();
                store.dispatch(setAuthResult(authResult));
              }
            })
            .catch(clearEmailVerifyInterval),
        5000,
      );
    }
    saveAuthOnServer(authResult);
    store.dispatch(setAuthResult(authResult));
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      clearAllInterval();
      store.dispatch(clearAuthResult());
    }
  });
};
//
//
const clearEmailVerifyInterval = () => {
  emailVerifyInterval && clearInterval(emailVerifyInterval);
  emailVerifyInterval = null;
};
const clearRefreshInterval = () => {
  refreshInterval && clearInterval(refreshInterval);
  refreshInterval = null;
};

const clearAllInterval = () => {
  clearEmailVerifyInterval();
  clearRefreshInterval();
};

const saveAuthOnServer = async (authResult: firebase.auth.UserCredential) => {
  const user = authResult.user;
  if (user) {
    try {
      return firebase
        .firestore()
        .collection('/lastAuth/')
        .doc(user.uid)
        .set({
          displayName: user.displayName,
          email: user.email,
          providerId: authResult.additionalUserInfo?.providerId || null,
          uid: user.uid,
          last_signin_at: serverTimestamp(),
          refresh_at: serverTimestamp(),
        });
    } catch (error) {
      console.log('sendAuth error: ', error);
    }
  }
};
const refreshAuthOnServer = async (authResult: firebase.auth.UserCredential) => {
  const user = authResult.user;
  if (user) {
    try {
      return firebase
        .firestore()
        .collection('/lastAuth/')
        .doc(user.uid)
        .set({ last_refresh_at: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.log('sendAuth error: ', error);
    }
  }
};
const needEmailVerified = (authResult: firebase.auth.UserCredential | null): boolean => {
  return !!(
    authResult?.additionalUserInfo?.providerId === firebase.auth.EmailAuthProvider.PROVIDER_ID &&
    !authResult?.user?.emailVerified
  );
};
