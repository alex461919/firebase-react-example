import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import React, { useEffect } from 'react';
import 'firebase/compat/auth';

export const signInSuccessObserver = {
  callbackList: [] as Array<(a: firebase.auth.UserCredential) => void>,
  onSignInSuccess: function (cb: (a: firebase.auth.UserCredential) => void): firebase.Unsubscribe {
    this.callbackList.push(cb);
    return () => {
      this.callbackList = this.callbackList.filter((item) => item !== cb);
    };
  },
  signInSuccessHandler: function (authResult: firebase.auth.UserCredential): void {
    this.callbackList.forEach((item) => {
      item(authResult);
    });
  },
};

const uiConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      clientId: '664089236150-asp4859li8gg8iqfe76t5rdl78eegk3c.apps.googleusercontent.com',
    },
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: (authResult) => {
      const user = authResult.user;
      const additionalUserInfo = authResult.additionalUserInfo;
      signInSuccessObserver.signInSuccessHandler(authResult);
      if (
        additionalUserInfo?.providerId === firebase.auth.EmailAuthProvider.PROVIDER_ID &&
        additionalUserInfo?.isNewUser
      ) {
        user?.sendEmailVerification();
      }
      return false;
    },
  },
};

export const AuthUIWidget: React.FC = () => {
  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
    ui.disableAutoSignIn();
    ui.start('#firebaseui-auth-container', uiConfig);
    return () => {
      ui.reset();
    };
  }, []);
  return React.createElement('div', { id: 'firebaseui-auth-container' });
};
