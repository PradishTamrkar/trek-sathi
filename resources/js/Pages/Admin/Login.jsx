import { Head, useForm } from '@inertiajs/react';
import {
    Box, Card, TextField, Button, Typography, Checkbox,
    FormControlLabel, Divider, Alert, CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AdminLogin() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = e => {
        e.preventDefault();
        post(route('admin.login.post'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Admin Login — TrekSathi" />

            <Box sx={{ display: 'flex', minHeight: '100vh' }}>

                {/* ── Left panel ── */}
                <Box
                    sx={{
                        display: { xs: 'none', lg: 'flex' },
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 8,
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'linear-gradient(160deg, #0d1f14 0%, #1a3a2f 50%, #2d5a3d 100%)',
                    }}
                >
                    {/* Stars */}
                    <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `
                        radial-gradient(1px 1px at 15% 18%, rgba(255,255,255,.8) 0%, transparent 100%),
                        radial-gradient(1.5px 1.5px at 40% 8%, rgba(255,255,255,1) 0%, transparent 100%),
                        radial-gradient(1px 1px at 70% 14%, rgba(255,255,255,.6) 0%, transparent 100%),
                        radial-gradient(1px 1px at 85% 25%, rgba(255,255,255,.7) 0%, transparent 100%),
                        radial-gradient(1px 1px at 30% 40%, rgba(255,255,255,.4) 0%, transparent 100%)`,
                    }} />

                    {/* Mountain SVG */}
                    <Box component="svg" viewBox="0 0 400 280" fill="none" sx={{ width: '100%', maxWidth: 380, mb: 5, position: 'relative', zIndex: 1 }}>
                        <path d="M0 280L0 195L65 148L125 175L190 105L255 145L310 75L365 120L400 98L400 280Z" fill="#1a3a2a" opacity=".5"/>
                        <path d="M70 280L200 55L330 280Z" fill="#1e3a2f"/>
                        <path d="M30 280L200 35L370 280Z" fill="#2d5a3d" opacity=".7"/>
                        <path d="M200 35L218 68L230 61L243 80L226 87L209 74L193 87L176 80L189 61L201 68Z" fill="white" opacity=".85"/>
                        <path d="M0 280L0 222L90 168L155 205L155 280Z" fill="#163020"/>
                        <path d="M245 280L245 205L310 162L400 198L400 280Z" fill="#163020"/>
                    </Box>

                    <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight={900} color="white" sx={{ fontFamily: 'Georgia, serif', mb: 1 }}>
                            Trek<Box component="span" sx={{ color: 'secondary.main' }}>Sathi</Box>
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>Admin Dashboard</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.35)', maxWidth: 280, mx: 'auto', lineHeight: 1.7 }}>
                            Manage trekking routes, regions, permits, and community submissions.
                        </Typography>
                    </Box>

                    {/* Back link */}
                    <Box
                        component="a"
                        href="/"
                        sx={{
                            position: 'absolute', bottom: 32,
                            display: 'flex', alignItems: 'center', gap: 0.5,
                            color: 'rgba(255,255,255,0.3)',
                            textDecoration: 'none', fontSize: '0.8rem',
                            '&:hover': { color: 'rgba(255,255,255,0.6)' },
                            transition: 'color 0.2s',
                        }}
                    >
                        <ArrowBackIcon sx={{ fontSize: 14 }} />
                        Back to TrekSathi
                    </Box>
                </Box>

                {/* ── Right form panel ── */}
                <Box sx={{
                    width: { xs: '100%', lg: '420px', xl: '480px' },
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: 'grey.50', px: 4, py: 6,
                }}>
                    <Box sx={{ width: '100%', maxWidth: 360 }}>

                        {/* Mobile logo */}
                        <Box sx={{ display: { lg: 'none' }, textAlign: 'center', mb: 4 }}>
                            <Typography variant="h4" fontWeight={900} sx={{ fontFamily: 'Georgia, serif' }}>
                                Trek<Box component="span" sx={{ color: 'secondary.main' }}>Sathi</Box>
                            </Typography>
                        </Box>

                        {/* Lock icon + header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <Box sx={{
                                width: 36, height: 36, borderRadius: 2,
                                bgcolor: 'primary.main',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <LockOutlinedIcon sx={{ color: 'white', fontSize: 18 }} />
                            </Box>
                            <Box sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 0.5,
                                bgcolor: 'success.50', color: 'success.700',
                                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                                textTransform: 'uppercase', px: 1.5, py: 0.4,
                                borderRadius: '100px',
                                border: '1px solid', borderColor: 'success.200',
                            }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
                                Admin Portal
                            </Box>
                        </Box>

                        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: 'Georgia, serif', mb: 0.5, mt: 2 }}>
                            Welcome back
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Sign in to access the admin dashboard
                        </Typography>

                        {/* Form */}
                        <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                            <TextField
                                label="Email Address"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                autoFocus
                                autoComplete="username"
                                error={!!errors.email}
                                helperText={errors.email}
                                placeholder="admin@treksathi.com"
                            />

                            <TextField
                                label="Password"
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                autoComplete="current-password"
                                error={!!errors.password}
                                helperText={errors.password}
                                placeholder="••••••••"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        size="small"
                                        color="primary"
                                    />
                                }
                                label={<Typography variant="body2" color="text.secondary">Keep me signed in</Typography>}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                disabled={processing}
                                sx={{ py: 1.5, fontSize: '0.95rem' }}
                            >
                                {processing
                                    ? <CircularProgress size={20} color="inherit" />
                                    : 'Sign In to Dashboard'
                                }
                            </Button>
                        </Box>

                        {/* Security note */}
                        <Card variant="outlined" sx={{ mt: 3, p: 1.5, bgcolor: 'grey.50', borderColor: 'grey.200' }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                <LockOutlinedIcon sx={{ fontSize: 15, color: 'text.disabled', mt: 0.2 }} />
                                <Typography variant="caption" color="text.disabled" lineHeight={1.6}>
                                    Admin access only. Unauthorized login attempts are logged and monitored.
                                </Typography>
                            </Box>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
