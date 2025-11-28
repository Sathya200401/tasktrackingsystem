import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import React from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
  showIcon?: boolean;
}

export const EmptyState: React.FC<Props> = ({ title = 'Nothing here', subtitle = '', action, showIcon = true }) => (
  <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
    <Stack spacing={2} alignItems="center">
      {showIcon && (
        <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v20" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 12h14" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Box>
      )}
      <Typography variant="h6">{title}</Typography>
      {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
      {action && (
        <Button variant="contained" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Stack>
  </Paper>
);

export default EmptyState;
