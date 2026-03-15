import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Box, Button, Typography, Container, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Alert, CircularProgress,
    Tabs, Tab, Divider,
} from '@mui/material';
import TerrainIcon from '@mui/icons-material/Terrain';
import UserLayout from '../../Layouts/UserLayout';

//Auth Modal
function AuthModal({ open, onClose, defaultTab = 0 }) {
    const [tab, setTab] = useState(defaultTab);

    const loginForm = useForm({ email: '', password: '' });
    const registerForm = useForm({ name: '', email: '', password: '', password_confirmation: '' });

    const handleLogin = (e) => {
        e.preventDefault();
        loginForm.post(route('user.login'), {
            onFinish: () => loginForm.reset('password'),
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        registerForm.post(route('user.register'), {
            onFinish: () => registerForm.reset('password', 'password_confirmation'),
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle sx={{ pb: 0 }}>
                <Typography variant="h6" fontWeight={700}>Welcome to TrekSathi</Typography>
            </DialogTitle>

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label="Sign In" />
                <Tab label="Register" />
            </Tabs>

            {/* Login tab */}
            {tab === 0 && (
                <Box component="form" onSubmit={handleLogin}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {loginForm.errors.email && (
                            <Alert severity="error">{loginForm.errors.email}</Alert>
                        )}
                        <TextField
                            label="Email"
                            type="email"
                            value={loginForm.data.email}
                            onChange={e => loginForm.setData('email', e.target.value)}
                            autoFocus
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={loginForm.data.password}
                            onChange={e => loginForm.setData('password', e.target.value)}
                            required
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1 }}>
                        <Button type="submit" variant="contained" fullWidth disabled={loginForm.processing}>
                            {loginForm.processing ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
                        </Button>
                        <Button color="inherit" size="small" onClick={() => setTab(1)}>
                            Don't have an account? Register
                        </Button>
                    </DialogActions>
                </Box>
            )}

            {/* Register tab */}
            {tab === 1 && (
                <Box component="form" onSubmit={handleRegister}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {registerForm.errors.email && (
                            <Alert severity="error">{registerForm.errors.email}</Alert>
                        )}
                        <TextField
                            label="Full Name"
                            value={registerForm.data.name}
                            onChange={e => registerForm.setData('name', e.target.value)}
                            error={!!registerForm.errors.name}
                            helperText={registerForm.errors.name}
                            autoFocus
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={registerForm.data.email}
                            onChange={e => registerForm.setData('email', e.target.value)}
                            error={!!registerForm.errors.email}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={registerForm.data.password}
                            onChange={e => registerForm.setData('password', e.target.value)}
                            error={!!registerForm.errors.password}
                            helperText={registerForm.errors.password}
                            required
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={registerForm.data.password_confirmation}
                            onChange={e => registerForm.setData('password_confirmation', e.target.value)}
                            required
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1 }}>
                        <Button type="submit" variant="contained" fullWidth disabled={registerForm.processing}>
                            {registerForm.processing ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
                        </Button>
                        <Button color="inherit" size="small" onClick={() => setTab(0)}>
                            Already have an account? Sign in
                        </Button>
                    </DialogActions>
                </Box>
            )}
        </Dialog>
    );
}

// ── Landing hero (shown to guests) ───────────────────────────────────────────
function LandingPage() {
    const [authOpen, setAuthOpen] = useState(false);
    const [authTab,  setAuthTab]  = useState(0);

    const openLogin    = () => { setAuthTab(0); setAuthOpen(true); };
    const openRegister = () => { setAuthTab(1); setAuthOpen(true); };

    return (
        <>
            {/* Navbar */}
            <Box component="nav" sx={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: { xs: 3, md: 6 }, py: 2,
                backdropFilter: 'blur(12px)',
                bgcolor: 'rgba(10, 25, 15, 0.7)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <Typography variant="h6" fontWeight={900}
                    sx={{ color: 'white', fontFamily: 'Georgia, serif' }}>
                    Trek<Box component="span" sx={{ color: 'secondary.main' }}>Sathi</Box>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button onClick={openLogin} size="small"
                        sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}>
                        Sign In
                    </Button>
                    <Button onClick={openRegister} variant="contained" size="small">
                        Get Started
                    </Button>
                </Box>
            </Box>

            {/* Hero */}
            <Box sx={{
                minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(160deg, #0d1f14 0%, #1a3a2f 55%, #2d5a3d 100%)',
            }}>
                {/* Stars */}
                <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `
                    radial-gradient(1px 1px at 12% 15%, rgba(255,255,255,.9) 0%, transparent 100%),
                    radial-gradient(1.5px 1.5px at 35% 8%,  rgba(255,255,255,1)  0%, transparent 100%),
                    radial-gradient(1px 1px at 60% 12%, rgba(255,255,255,.7) 0%, transparent 100%),
                    radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,.8) 0%, transparent 100%),
                    radial-gradient(1px 1px at 25% 40%, rgba(255,255,255,.4) 0%, transparent 100%),
                    radial-gradient(1.5px 1.5px at 75% 30%, rgba(255,255,255,.5) 0%, transparent 100%)`,
                }} />

                {/* Mountain silhouette */}
                <Box component="svg" viewBox="0 0 800 320" fill="none"
                    sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
                    <path d="M0 320L0 220L100 165L180 200L280 110L380 160L470 60L560 120L640 80L720 115L800 90L800 320Z"
                        fill="#1a3a2a" opacity=".45"/>
                    <path d="M0 320L0 240L80 195L160 225L240 175L320 205L400 140L480 175L560 145L640 170L720 150L800 165L800 320Z"
                        fill="#163020" opacity=".6"/>
                    <path d="M150 320L400 50L650 320Z"  fill="#2d5a3d" opacity=".5"/>
                    <path d="M100 320L400 30L700 320Z"  fill="#1e3a2f" opacity=".7"/>
                    <path d="M400 30L422 72L438 64L454 85L434 94L414 80L396 93L376 84L392 63L406 72Z"
                        fill="white" opacity=".9"/>
                </Box>

                {/* Content */}
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', pt: 8 }}>
                    <Box sx={{
                        display: 'inline-flex', alignItems: 'center', gap: 1,
                        bgcolor: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '100px', px: 2, py: 0.6, mb: 3,
                    }}>
                        <TerrainIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em' }}>
                            AI-Powered Nepal Trekking Companion
                        </Typography>
                    </Box>

                    <Typography variant="h1" sx={{
                        fontSize: { xs: '2.8rem', md: '4.5rem' },
                        fontFamily: 'Georgia, serif',
                        color: 'white', lineHeight: 1.1, mb: 2.5,
                    }}>
                        Explore Nepal's<br />
                        <Box component="span" sx={{ color: 'secondary.main' }}>Greatest Treks</Box>
                    </Typography>

                    <Typography variant="body1" sx={{
                        color: 'rgba(255,255,255,0.55)',
                        maxWidth: 520, mx: 'auto', mb: 5, lineHeight: 1.8,
                    }}>
                        Plan your perfect adventure with AI guidance, real-time trail conditions,
                        permit info, and community insights — all in one place.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button variant="contained" size="large" onClick={openRegister}
                            sx={{ px: 4, py: 1.5, fontSize: '1rem' }}>
                            Start Planning Free
                        </Button>
                        <Button variant="outlined" size="large" onClick={openLogin} sx={{
                            px: 4, py: 1.5, fontSize: '1rem',
                            borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.8)',
                            '&:hover': { borderColor: 'white', color: 'white', bgcolor: 'rgba(255,255,255,0.05)' },
                        }}>
                            Sign In
                        </Button>
                    </Box>

                    {/* Feature pills */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 6 }}>
                        {['🤖 AI Chat', '🗺️ 50+ Routes', '📋 Permit Info', '🏠 Tea Houses', '👥 Community'].map(f => (
                            <Box key={f} sx={{
                                bgcolor: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '100px', px: 2, py: 0.75,
                            }}>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>{f}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
        </>
    );
}

// ── Authenticated home (shown after login) ────────────────────────────────────
function AuthenticatedHome({ user }) {
    return (
        <UserLayout>
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Welcome back, {user.name} 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Your AI-powered Nepal trekking companion is ready. What are you planning next?
                </Typography>
            </Box>
        </UserLayout>
    );
}

// ── Root export — decides which view to show ──────────────────────────────────
export default function Home() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="TrekSathi — Your Nepal Trekking Companion" />
            {auth?.user
                ? <AuthenticatedHome user={auth.user} />
                : <LandingPage />
            }
        </>
    );
}
