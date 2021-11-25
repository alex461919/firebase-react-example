import { JWT, TokenInfo } from 'google-auth-library';
import admin from 'firebase-admin';
import keys from '../serviceAccountKey.json';

export interface BaseMessage {
  data?: { [key: string]: string };
  notification?: admin.messaging.Notification;
  android?: admin.messaging.AndroidConfig;
  webpush?: admin.messaging.WebpushConfig;
  apns?: admin.messaging.ApnsConfig;
}

export interface TokenMessage extends BaseMessage {
  token: string;
}

export interface TopicMessage extends BaseMessage {
  topic: string;
}

export interface ConditionMessage extends BaseMessage {
  condition: string;
}

let client: JWT | undefined;

export const sendMessageToUser = async (message: TokenMessage): Promise<void> => {
  if (!client?.credentials.access_token) throw new Error('Firebase admin client is not registered');
  const url = `https://fcm.googleapis.com/v1/projects/${keys.project_id}/messages:send`;

  const msg = { message, validate_only: false };
  //console.log('---------------- send message: ', msg);
  const res = await client.request<TokenMessage>({ url, method: 'POST', data: msg });
  console.log('---------------- message send success: ', res);
};

export const senderRegister = async (): Promise<void> => {
  client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });

  await client.authorize();

  if (typeof client.credentials.access_token === 'string') {
    const tokenInfo = (await client.getTokenInfo(client.credentials.access_token)) as TokenInfo & {
      exp: number;
    };
    console.log('tokenInfo: ', {
      ...tokenInfo,
      expiry_date: new Date(tokenInfo.expiry_date).toLocaleString(),
      exp: new Date(tokenInfo.exp * 1000).toLocaleString(),
    });
  }
};
