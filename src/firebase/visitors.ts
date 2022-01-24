import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useCurrentUser } from './auth';

export interface Visitor extends firebase.UserInfo {
  signIn_at: number | null;
  refresh_at: number | null;
  fcmToken: string | null;
  fcmTokenRefresh_at: number | null;
}

export const useVisitors = () => {
  const user = useCurrentUser();
  const [list, setList] = useState<Array<Visitor>>([]);
  useEffect(() => {
    if (user) {
      return firebase
        .firestore()
        .collection('/last/')
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
                signIn_at: (data.signIn_at as Timestamp)?.toMillis() || null,
                refresh_at: (data.refresh_at as Timestamp)?.toMillis() || null,
                fcmTokenRefresh_at: (data.fcmTokenRefresh_at as Timestamp)?.toMillis() || null,
                fcmToken: data.fcmToken,
              });
            });
            setList(list);
          }
        });
    }
  }, [user]);
  return list;
};
