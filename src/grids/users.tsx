import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/Check';
import { SvgIcon } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import './users.scss';
import { providerIcons } from './providerIcons';
import { SendMessageFormValues, SendMessagesForm } from './sendMessagesForm';
import { Visitor } from '../firebase/visitors';
import { useCurrentUser } from '../firebase/auth';

export type { SendMessageFormValues };

const remoteUsersColumns: GridColDef[] = [
  { field: 'col1', headerName: 'Имя', minWidth: 160, flex: 1 },
  { field: 'col2', headerName: 'Email', flex: 1 },
  {
    field: 'col3',
    headerName: 'Провайдер',
    align: 'center',
    renderCell: (params: GridRenderCellParams) => {
      const paths = params.value && providerIcons[params.value];
      return paths ? (
        <SvgIcon sx={{ fontSize: 20 }} viewBox="0 0 20 20">
          {paths}
        </SvgIcon>
      ) : (
        <HelpOutline sx={{ fontSize: 24 }} color="warning"></HelpOutline>
      );
    },
  },
  { field: 'col4', headerName: 'Последняя \nавторизация', flex: 1 },
  { field: 'col5', headerName: 'Сессия обновлена', flex: 1 },
  {
    field: 'col6',
    headerName: 'FCM токен',
    align: 'center',
    renderCell: (params: GridRenderCellParams) => (params.value ? <CheckIcon color="success" /> : ''),
  },
];
const remoteUsersToRows = (list: Array<Visitor>) => {
  return list.map((item) => ({
    id: item.uid,
    col1: item.displayName,
    col2: item.email,
    col3: item.providerId,
    col4: (item.signIn_at && new Date(item.signIn_at).toLocaleString()) || '',
    col5: (item.refresh_at && new Date(item.refresh_at).toLocaleString()) || '',
    col6: !!item.fcmToken,
  }));
};

export const RemoteUsersGrid: React.FC<{
  remoteUsersList: Array<Visitor>;
  onSubmit?: (to: Array<Visitor>, values: SendMessageFormValues) => void;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}> = ({ remoteUsersList, onSubmit = () => {} }) => {
  //
  const user = useCurrentUser();
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const submitHandler = (values: SendMessageFormValues): void =>
    onSubmit(
      remoteUsersList.filter((item) => selectionModel.includes(item.uid)),
      values,
    );
  return (
    <>
      <SendMessagesForm onSubmit={submitHandler} disabled={!selectionModel.length} />
      <DataGrid
        getRowClassName={(params) => (params.id === user?.uid ? 'my-account-background' : '')}
        density="compact"
        autoHeight
        hideFooterSelectedRowCount
        rows={remoteUsersToRows(remoteUsersList)}
        columns={remoteUsersColumns}
        checkboxSelection
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
      />
    </>
  );
};
