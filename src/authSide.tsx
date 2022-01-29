import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import firebase from 'firebase/compat/app';
import { useCurrentUser } from './firebase/auth';

export const AuthSide: React.FC = () => {
  const user = useCurrentUser();
  if (user) {
    return (
      <Grid component="aside" container spacing={3} alignItems="center">
        <Grid item>
          <Typography component="span">Hi,&nbsp;&nbsp;{user.displayName} !</Typography>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={() => firebase.auth().signOut()}>
            Sign-out
          </Button>
        </Grid>
      </Grid>
    );
  }
  return null;
};
