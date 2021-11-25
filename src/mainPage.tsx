import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { RemoteUsersGrid, SendMessageFormValues } from './grids/users';
import './mainPage.scss';
import { FiberManualRecord } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useCurrentUser } from './firebase/auth';
import { useVisitors, Visitor } from './firebase/visitors';
import { BaseMessage, sendMessageToUser } from './firebase/sender';
import { MessagesGrid } from './grids/messages';

export const MainPage: React.FC = () => {
  const user = useCurrentUser();
  const visitorsList = useVisitors();
  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = (recipients: Array<Visitor>, values: SendMessageFormValues): void => {
    const message: BaseMessage = {};
    if (values.title.length || values.body.length) {
      message.notification = {};
      if (values.title.length) message.notification.title = values.title;
      if (values.body.length) message.notification.body = values.body;
    }
    if (values.key1.length || values.key2.length) {
      message.data = {};
      if (values.key1.length) message.data.key1 = values.key1;
      if (values.key2.length) message.data.key2 = values.key2;
    }
    Promise.all(
      recipients.map(async (item): Promise<boolean> => {
        if (!item.fcm_token) return false;
        return sendMessageToUser({ ...message, token: item.fcm_token })
          .then(() => true)
          .catch((error) => {
            console.error(error);
            return false;
          });
      }),
    ).then((val) => {
      const success = val.filter((item) => item).length;
      const error = val.filter((item) => !item).length;
      success && enqueueSnackbar(`Успешно отправлено сообщений: ${success}`, { variant: 'success' });
      error && enqueueSnackbar(`Не удалось отправить сообщений: ${error}`, { variant: 'error' });
    });
  };

  return visitorsList.length ? (
    <>
      <Box position="relative">
        <RemoteUsersGrid {...{ remoteUsersList: visitorsList }} onSubmit={submitHandler} />

        <Box m={3} pl={1} position="absolute" left={0} bottom={0} display={user ? 'flex' : 'none'} alignItems="center">
          <FiberManualRecord fontSize="small" sx={{ color: 'rgba(0, 218, 7, 0.38)' }} />
          &nbsp;&nbsp;Это я!
        </Box>
      </Box>

      <Box>
        <Typography variant="h5" component="h2" mt={4} mb={3}>
          Полученные сообщения
        </Typography>
        <MessagesGrid />
      </Box>
    </>
  ) : (
    <Box
      className="fixed-center"
      position="fixed"
      top={0}
      left={0}
      bottom={0}
      right={0}
      display="flex"
      justifyContent="center"
      alignItems="center">
      <CircularProgress size="4rem" />
    </Box>
  );
};
