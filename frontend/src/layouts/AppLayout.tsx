import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { label: 'Dashboard', to: '/', icon: <SpaceDashboardOutlinedIcon /> },
  { label: 'Tasks', to: '/tasks', icon: <AssignmentOutlinedIcon /> },
  { label: 'Employees', to: '/employees', icon: <GroupOutlinedIcon /> },
];

export type TaskStatus = 'todo' | 'in_progress' | 'in_testing' | 'in_review' | 'blocked' | 'requires_attention' | 'done';

export const AppLayout = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Sidebar */}
      <Box
        component="aside"
        sx={{
          width: 260,
          px: 4,
          py: 6,
          backgroundColor: '#0f172a',
          color: '#e5e7eb',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',

          // Make the sidebar sticky so it stays visible during page scroll
          position: 'sticky',
          top: 0,
          alignSelf: 'flex-start',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Logo / Brand */}
        <Box>
          <Typography variant="overline" sx={{ color: '#94a3b8', letterSpacing: 1.2 }}>
            TASKOPS
          </Typography>
          <Typography variant="h5" fontWeight={700} color="#fff">
            Command
          </Typography>
        </Box>

        {/* Navigation - grouped near the top */}
        <Box sx={{ mt: 3 }}>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <ListItemButton
                  key={item.to}
                  component={Link}
                  to={item.to}
                  sx={{
                    height: 48, // uniform height (h-12)
                    borderRadius: '6px', // subtle rounded corners (approx 6px)
                    px: 2,
                    color: active ? 'primary.main' : '#9ca3af', // inactive grey, active primary
                    bgcolor: active ? 'rgba(91,52,234,0.12)' : 'transparent', // subtle active bg
                    '&:hover': {
                      bgcolor: active ? 'rgba(91,52,234,0.16)' : 'rgba(255,255,255,0.06)',
                      color: '#fff',
                    },
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem', // text-sm
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: 'inherit',
                      '& svg': { width: 20, height: 20 }, // consistent icon sizing w-5 h-5
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      color: 'inherit',
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Push session controls to the bottom */}
        <Box sx={{ mt: 'auto' }}>
          <Stack spacing={1}>
            <Typography variant="caption" color="#94a3b8">
              Session
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: '#4c1d95', width: 40, height: 40 }}>{user?.name?.charAt(0)}</Avatar>
              <Box>
                <Typography variant="subtitle2" color="#fff" fontWeight={600}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="#cbd5f5">
                  {user?.email}
                </Typography>
              </Box>
            </Stack>
            <Chip
              size="small"
              label={isAdmin ? 'Admin access' : 'View only'}
              sx={{ width: 'fit-content', bgcolor: 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 600 }}
            />
            <Button
              onClick={logout}
              startIcon={<LogoutRoundedIcon />}
              variant="outlined"
              sx={{
                mt: 1,
                borderColor: 'rgba(255,255,255,0.12)',
                color: '#fff',
                '&:hover': { borderColor: 'rgba(255,255,255,0.2)' },
                textTransform: 'none',
              }}
            >
              Sign out
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
        <Paper
          sx={{
            borderRadius: 3,
            mb: 3,
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton size="small" color="primary" sx={{ border: '1px solid', borderColor: 'grey.200' }}>
              <SearchOutlinedIcon />
            </IconButton>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Nexus TaskOps
              </Typography>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Delivery Mission Control
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton size="small" onClick={toggleTheme} title={isDarkMode ? 'Light mode' : 'Dark mode'}>
              {isDarkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
            <Chip label={isAdmin ? 'Admin' : 'Viewer'} color={isAdmin ? 'primary' : 'default'} variant={isAdmin ? 'filled' : 'outlined'} />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              Role: <strong>{isAdmin ? 'Admin' : 'Viewer'}</strong>
            </Typography>
            <Divider orientation="vertical" flexItem />
            <IconButton>
              <NotificationsNoneOutlinedIcon />
            </IconButton>
          </Stack>
        </Paper>

        <Outlet />
      </Box>
    </Box>
  );
};