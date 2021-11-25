import React from 'react';
import { Box, BoxProps, Container, Grid, Typography } from '@mui/material';
import { AuthSide } from './authSide';
import { AuthUIWidget } from './firebase/firebaseuiWidget';
import { MainPage } from './mainPage';
import { useCurrentUser, useNeedEmailVerified } from './firebase/auth';

const App: React.FC = () => {
  const user = useCurrentUser();
  const needEmailVerified = useNeedEmailVerified();

  let Content: React.FC = () => (
    <Container fixed>
      <Box my={5}>
        <MainPage />
      </Box>
    </Container>
  );

  if (!user)
    Content = () => (
      <CenterBox>
        <AuthUIWidget />
      </CenterBox>
    );

  if (user && needEmailVerified) Content = () => <Note />;

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Content />
    </Box>
  );
};
const CenterBox: React.FC<BoxProps> = ({ children, ...boxProps }) => (
  <Container fixed sx={{ my: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
    <Box {...boxProps}>{children}</Box>
  </Container>
);

const Header: React.FC = () => {
  return (
    <Container maxWidth={false} sx={{ boxShadow: '0px 1px 15px 0px #b9bec3' }}>
      <Container fixed component="header">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="h1" my={4}>
              Firebase auth & notifications example
            </Typography>
          </Grid>
          <Grid>
            <AuthSide />
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
const Note: React.FC = () => (
  <CenterBox
    textAlign="center"
    p={4}
    bgcolor="#f8f8f8"
    border={1}
    borderColor="#c0c0c0"
    borderRadius={2}
    maxWidth="40rem">
    <Typography variant="h5" component="h2" color="error" mb={4} pb={3} borderBottom={1} borderColor="#c0c0c0">
      Вы зарегистрированы на сайте, но не подтвердили свой email !
    </Typography>
    <Typography component="p" fontSize=".875rem">
      После регистрации на сайте, на указанный email приходит письмо в котором указаны регистрационные данные, а также
      ссылка по которой необходимо перейти для подтверждения существования адреса электронной почты.
    </Typography>
  </CenterBox>
);

export default App;
