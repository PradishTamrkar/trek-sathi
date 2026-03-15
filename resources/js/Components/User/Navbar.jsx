import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Typography, Divider, Alert, CircularProgress,
    IconButton, Avatar, Menu, MenuItem,
} from '@mui/material';
import TerrainIcon from '@mui/icons-material/Terrain';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';

//Login Modal
function LoginModal({ open, onClose, onSwitchToSignUp }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('user.login'), {
            onSuccess: () => { reset(); onClose(); },
            onFinish:  () => reset('password'),
        });
    };

    const handleClose = () => { reset(); onClose(); };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1, pr: 6 }}>
                <Typography variant="h6" fontWeight={700}>Welcome back</Typography>
                <Typography variant="caption" color="text.secondary">
                    Sign in to your TrekSathi account
                </Typography>
                <IconButton onClick={handleClose} size="small"
                    sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <Divider />

            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2.5 }}>
                    {errors.email && <Alert severity="error">{errors.email}</Alert>}
                    <TextField
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        error={!!errors.email}
                        autoFocus required
                        placeholder="you@example.com"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        required
                        placeholder="••••••••"
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1.5, alignItems: 'stretch' }}>
                    <Button type="submit" variant="contained" fullWidth disabled={processing} sx={{ py: 1.25 }}>
                        {processing ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            Don't have an account?{' '}
                            <Box component="span"
                                onClick={() => { handleClose(); onSwitchToSignUp(); }}
                                sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                Sign Up
                            </Box>
                        </Typography>
                    </Box>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

// ── Sign Up Modal ─────────────────────────────────────────────────────────────
function SignUpModal({ open, onClose, onSwitchToLogin }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('user.register'), {
            onSuccess: () => { reset(); onClose(); },
            onFinish:  () => reset('password', 'password_confirmation'),
        });
    };

    const handleClose = () => { reset(); onClose(); };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1, pr: 6 }}>
                <Typography variant="h6" fontWeight={700}>Create your account</Typography>
                <Typography variant="caption" color="text.secondary">
                    Start planning your Nepal trek today
                </Typography>
                <IconButton onClick={handleClose} size="small"
                    sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <Divider />

            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2.5 }}>
                    {errors.email && <Alert severity="error">{errors.email}</Alert>}
                    <TextField
                        label="Full Name"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        autoFocus required
                        placeholder="Your Name"
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        error={!!errors.email}
                        required
                        placeholder="you@example.com"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        required
                        placeholder="Min. 8 characters"
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        required
                        placeholder="Repeat password"
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1.5, alignItems: 'stretch' }}>
                    <Button type="submit" variant="contained" fullWidth disabled={processing} sx={{ py: 1.25 }}>
                        {processing ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            Already have an account?{' '}
                            <Box component="span"
                                onClick={() => { handleClose(); onSwitchToLogin(); }}
                                sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                Sign In
                            </Box>
                        </Typography>
                    </Box>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
export default function Navbar({ user = null }) {
    const [loginOpen,   setLoginOpen]   = useState(false);
    const [signUpOpen,  setSignUpOpen]  = useState(false);
    const [anchorEl,    setAnchorEl]    = useState(null);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <>
            <Box component="nav" sx={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: { xs: 3, md: 6 }, py: 1.75,
                backdropFilter: 'blur(14px)',
                bgcolor: 'rgba(10, 25, 15, 0.72)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
                {/* Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TerrainIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
                    <Typography variant="h6" fontWeight={900}
                        sx={{ color: 'white', fontFamily: 'Georgia, serif', letterSpacing: '-0.01em' }}>
                        Trek<Box component="span" sx={{ color: 'secondary.main' }}>Sathi</Box>
                    </Typography>
                </Box>

                {/* Right side */}
                {user ? (
                    // Authenticated — show avatar + user menu
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', display: { xs: 'none', sm: 'block' } }}>
                            {user.name}
                        </Typography>
                        <Avatar
                            onClick={e => setAnchorEl(e.currentTarget)}
                            sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: '0.8rem',
                                fontWeight: 700, cursor: 'pointer',
                                '&:hover': { opacity: 0.85 },
                            }}>
                            {user.name?.[0]?.toUpperCase() ?? 'U'}
                        </Avatar>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            PaperProps={{ sx: { minWidth: 160, borderRadius: 2, mt: 0.5 } }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                            <MenuItem disabled sx={{ opacity: '1 !important' }}>
                                <Typography variant="caption" color="text.secondary" noWrap>{user.email}</Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout} sx={{ color: 'error.main', gap: 1 }}>
                                <LogoutIcon fontSize="small" /> Sign Out
                            </MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    // Guest — Login + Sign Up
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Button
                            onClick={() => setLoginOpen(true)}
                            size="small"
                            sx={{
                                color: 'rgba(255,255,255,0.75)',
                                px: 2,
                                '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
                            }}>
                            Login
                        </Button>
                        <Button
                            onClick={() => setSignUpOpen(true)}
                            variant="contained"
                            size="small"
                            sx={{ px: 2.5 }}>
                            Sign Up
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Modals */}
            <LoginModal
                open={loginOpen}
                onClose={() => setLoginOpen(false)}
                onSwitchToSignUp={() => setSignUpOpen(true)}
            />
            <SignUpModal
                open={signUpOpen}
                onClose={() => setSignUpOpen(false)}
                onSwitchToLogin={() => setLoginOpen(true)}
            />
        </>
    );
}
