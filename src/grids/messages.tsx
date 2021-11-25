import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useBackgroundMessage, useMessage } from '../firebase/messaging';
import { BaseMessage } from '../firebase/sender';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const makeid = require('makeid');

const messagesColumns: GridColDef[] = [
  { field: 'col1', headerName: 'Получен', minWidth: 160 },
  { field: 'col2', headerName: 'Тип', minWidth: 160 },
  {
    field: 'col3',
    flex: 1,
    headerName: 'Notification',
    renderCell: (params: GridRenderCellParams) =>
      (params.value?.title ? `title: "${params.value.title}" ${'\u00A0'} ${'\u00A0'}` : '') +
      (params.value?.body ? `body: "${params.value.body}"` : ''),
  },
  {
    field: 'col4',
    flex: 1,
    headerName: 'Data',
    renderCell: (params: GridRenderCellParams) =>
      params.value
        ? Object.entries(params.value).reduce(
            (acc, current) => `${acc} ${current[0]}: "${current[1]}"  ${'\u00A0'} ${'\u00A0'}`,
            '',
          )
        : '',
  },
];

const messagesToRows = (messages: Array<DeliveredMessage>): GridRowsProp => {
  return messages.map((item) => {
    const filteredData =
      item.data && Object.fromEntries(Object.entries(item.data).filter((entrie) => !/(^google)|(^gcm)/.test(entrie[0])));
    return {
      id: makeid('AAAAAAA') as string,
      col1: new Date().toLocaleString(),
      col2: item.method,
      col3: item.notification,
      col4: filteredData,
    };
  });
};

interface DeliveredMessage extends BaseMessage {
  method: 'foreground' | 'background';
}

export const MessagesGrid: React.FC = () => {
  const foregroundMessage = useMessage();
  const backgroundMessage = useBackgroundMessage();
  const [messageList, setMessageList] = useState<Array<DeliveredMessage>>([]);

  useEffect(() => {
    foregroundMessage && setMessageList([...messageList, { ...foregroundMessage, method: 'foreground' }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foregroundMessage]);
  useEffect(() => {
    backgroundMessage && setMessageList([...messageList, { ...backgroundMessage, method: 'background' }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundMessage]);

  return (
    <DataGrid
      density="compact"
      autoHeight
      rows={messagesToRows(messageList)}
      columns={messagesColumns}
      components={{
        NoRowsOverlay: () => (
          <Box position="absolute" width="100%" top="5rem" textAlign="center">
            Сообщений нет
          </Box>
        ),
      }}
    />
  );
};
