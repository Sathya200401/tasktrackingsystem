import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      showToast('Login successful!', 'success');
      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/';
      navigate(redirectTo, { replace: true });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Unable to log in. Check your credentials.';
      showToast(message, 'error');
    },
  });

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (field: 'email' | 'password') => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      mutation.mutate({ ...form });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg,#eef0f6,#f6f8fb)',
        p: 3,
      }}
    >
      <Paper component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 420, p: 4, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
        <Stack spacing={3}>
          <div>
            <Typography variant="overline" color="primary.main" fontWeight={600}>
              TaskOps
            </Typography>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Welcome back
            </Typography>
            <Typography color="text.secondary">Sign in to access your workspace.</Typography>
          </div>

          <TextField 
            label="Email" 
            type="email" 
            value={form.email} 
            onChange={handleChange('email')} 
            error={!!errors.email}
            helperText={errors.email}
            required 
            fullWidth 
          />
          <TextField 
            label="Password" 
            type="password" 
            value={form.password} 
            onChange={handleChange('password')} 
            error={!!errors.password}
            helperText={errors.password}
            required 
            fullWidth 
          />

          <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
            {mutation.isPending ? 'Signing in…' : 'Sign In'}
          </Button>

          <Typography variant="body2" color="text.secondary">
            Don&apos;t have an account?{' '}
            <Box component={Link} to="/signup" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Create one
            </Box>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

