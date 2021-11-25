import React, { useState } from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';

export interface SendMessageFormValues {
  title: string;
  body: string;
  key1: string;
  key2: string;
}

export const SendMessagesForm: React.FC<{ disabled?: boolean; onSubmit?: (values: SendMessageFormValues) => void }> = ({
  disabled = false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSubmit = () => {},
}) => {
  const [formValues, setFormValues] = useState<SendMessageFormValues>({ title: '', body: '', key1: '', key2: '' });

  const handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setFormValues({ ...formValues, [name]: value.trim() });
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onSubmit(formValues);
  };
  const submitDisabled = !Object.values(formValues).find((item: string) => item.trim().length);

  return (
    <>
      <Box component="form" noValidate autoComplete="off" my={4} onSubmit={handleSubmit}>
        <Grid container spacing={5}>
          <Grid item xs="auto">
            <TextField
              id="title"
              label="Title"
              name="title"
              size="small"
              variant="standard"
              onChange={handleInputChange}
              {...{ disabled }}
            />
          </Grid>
          <Grid item xs="auto">
            <TextField
              id="body"
              label="Body"
              name="body"
              size="small"
              variant="standard"
              onChange={handleInputChange}
              {...{ disabled }}
            />
          </Grid>
          <Grid item xs="auto">
            <TextField
              id="key1"
              label="Key1"
              name="key1"
              size="small"
              variant="standard"
              onChange={handleInputChange}
              {...{ disabled }}
            />
          </Grid>
          <Grid item xs="auto">
            <TextField
              id="key2"
              label="Key2"
              name="key2"
              size="small"
              variant="standard"
              onChange={handleInputChange}
              {...{ disabled }}
            />
          </Grid>
          <Grid item xs="auto" alignSelf="end" ml="auto">
            <Button variant="outlined" type="submit" disabled={submitDisabled || disabled}>
              Отправить
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
