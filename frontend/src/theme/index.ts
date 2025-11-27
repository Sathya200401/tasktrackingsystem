import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5b34ea',
      dark: '#4626b6',
    },
    secondary: {
      main: '#0ea5e9',
    },
    background: {
      default: '#f3f4f6',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475467',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 700,
      color: '#101828',
    },
    h6: {
      fontWeight: 600,
      color: '#101828',
    },
    body1: {
      color: '#1d2939',
    },
    body2: {
      color: '#475467',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: '1px solid #e4e7ec',
          boxShadow: '0 10px 25px rgba(15,23,42,0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: '1px solid #e4e7ec',
          boxShadow: '0 8px 20px rgba(15,23,42,0.04)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          boxShadow: '0 6px 16px rgba(91,52,234,0.25)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

