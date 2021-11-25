import { createTheme } from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';

const theme = createTheme({
  spacing: ['0', '.25rem', '.5rem', '1rem', '1.5rem', '3rem', '5rem'], // (factor: number) => `${0.25 * factor}rem`,
  typography: {
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          // backgroundColor: 'red',
        },
      },
    },
  },
});
export default theme;
