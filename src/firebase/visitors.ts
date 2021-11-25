import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useCurrentUser } from './auth';

export interface Visitor extends firebase.UserInfo {
  last_signin_at: number | null;
  last_refresh_at: number | null;
  fcm_token: string | null;
  fcm_token_refresh_at: number | null;
}

export const useVisitors = () => {
  const user = useCurrentUser();
  const [list, setList] = useState<Array<Visitor>>([]);
  useEffect(() => {
    if (user) {
      return firebase
        .firestore()
        .collection('/lastAuth')
        .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
          if (!snapshot.metadata.hasPendingWrites) {
            const list: Array<Visitor> = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              if (!data.uid) return;
              list.push({
                displayName: data.displayName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                photoURL: data.photoURL,
                providerId: data.providerId,
                uid: data.uid,
                last_signin_at: (data.last_signin_at as Timestamp)?.toMillis() || null,
                last_refresh_at: (data.last_refresh_at as Timestamp)?.toMillis() || null,
                fcm_token_refresh_at: (data.fcm_token_refresh_at as Timestamp)?.toMillis() || null,
                fcm_token: data.fcm_token,
              });
            });
            setList(list);
          }
        });
    }
  }, [user]);
  return list;
};
