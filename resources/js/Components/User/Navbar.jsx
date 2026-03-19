import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Typography, Divider, Alert, CircularProgress,
    IconButton, Avatar, Menu, MenuItem, Drawer, List, ListItem,
    ListItemButton, ListItemText,
} from '@mui/material';
import TerrainIcon   from '@mui/icons-material/Terrain';
import CloseIcon     from '@mui/icons-material/Close';
import LogoutIcon    from '@mui/icons-material/Logout';
import MenuIcon      from '@mui/icons-material/Menu';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// ── Login Modal ───────────────────────────────────────────────────────────────
function LoginModal({ open, onClose, onSwitchToSignUp }) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('user.login'), {
            onSuccess: () => { reset(); onClose(); },
            onFinish:  () => reset('password'),
        });
    };

    return (
        <Dialog open={open} onClose={() => { reset(); onClose(); }} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1, pr: 6 }}>
                <Typography variant="h6" fontWeight={700}>Welcome back</Typography>
                <Typography variant="caption" color="text.secondary">Sign in to your TrekSathi account</Typography>
                <IconButton onClick={() => { reset(); onClose(); }} size="small"
                    sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <Divider />
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2.5 }}>
                    {errors.email && <Alert severity="error">{errors.email}</Alert>}
                    <TextField label="Email" type="email" value={data.email}
                        onChange={e => setData('email', e.target.value)} autoFocus required placeholder="you@example.com" />
                    <TextField label="Password" type="password" value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        error={!!errors.password} helperText={errors.password} required placeholder="••••••••" />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1.5, alignItems: 'stretch' }}>
                    <Button type="submit" variant="contained" fullWidth disabled={processing} sx={{ py: 1.25 }}>
                        {processing ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            Don't have an account?{' '}
                            <Box component="span" onClick={() => { reset(); onClose(); onSwitchToSignUp(); }}
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
        name: '', email: '', password: '', password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('user.register'), {
            onSuccess: () => { reset(); onClose(); },
            onFinish:  () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <Dialog open={open} onClose={() => { reset(); onClose(); }} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1, pr: 6 }}>
                <Typography variant="h6" fontWeight={700}>Create your account</Typography>
                <Typography variant="caption" color="text.secondary">Start planning your Nepal trek today</Typography>
                <IconButton onClick={() => { reset(); onClose(); }} size="small"
                    sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <Divider />
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2.5 }}>
                    {errors.email && <Alert severity="error">{errors.email}</Alert>}
                    <TextField label="Full Name" value={data.name} onChange={e => setData('name', e.target.value)}
                        error={!!errors.name} helperText={errors.name} autoFocus required placeholder="Your Name" />
                    <TextField label="Email" type="email" value={data.email}
                        onChange={e => setData('email', e.target.value)} required placeholder="you@example.com" />
                    <TextField label="Password" type="password" value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        error={!!errors.password} helperText={errors.password} required placeholder="Min. 8 characters" />
                    <TextField label="Confirm Password" type="password" value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)} required placeholder="Repeat password" />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1.5, alignItems: 'stretch' }}>
                    <Button type="submit" variant="contained" fullWidth disabled={processing} sx={{ py: 1.25 }}>
                        {processing ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            Already have an account?{' '}
                            <Box component="span" onClick={() => { reset(); onClose(); onSwitchToLogin(); }}
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

// ── Mobile Drawer ─────────────────────────────────────────────────────────────
function MobileDrawer({ open, onClose, user, sectionLinks, onLogin, onSignUp }) {
    const handleSectionNav = (href) => {
        onClose();
        if (href.startsWith('#')) {
            setTimeout(() => {
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        } else {
            router.visit(href);
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}
            PaperProps={{ sx: { width: 280, bgcolor: '#0d1f14' } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: 2.5, py: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TerrainIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                    <Typography variant="h6" fontWeight={900} sx={{ color: 'white', fontFamily: 'Georgia, serif' }}>
                        Trek<Box component="span" sx={{ color: 'secondary.main' }}>Sathi</Box>
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* User info if logged in */}
            {user && (
                <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.dark', fontSize: '0.85rem', fontWeight: 700 }}>
                            {user.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600} color="white">{user.name}</Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{user.email}</Typography>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Nav links */}
            <List sx={{ px: 1, py: 1.5, flex: 1 }}>
                {user && (
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton onClick={() => { onClose(); router.visit('/chat'); }}
                            sx={{ borderRadius: 2, color: 'white', gap: 1.5,
                                bgcolor: 'rgba(76,175,80,0.12)', '&:hover': { bgcolor: 'rgba(76,175,80,0.2)' } }}>
                            <AutoAwesomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                            <ListItemText primary="Plan with AI" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                        </ListItemButton>
                    </ListItem>
                )}
                {sectionLinks.map(link => (
                    <ListItem key={link.label} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton onClick={() => handleSectionNav(link.href)}
                            sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}>
                            <ListItemText primary={link.label}
                                primaryTypographyProps={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* Bottom actions */}
            <Box sx={{ px: 2, py: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {user ? (
                    <Button fullWidth variant="outlined" startIcon={<LogoutIcon />}
                        onClick={() => { onClose(); router.post(route('logout')); }}
                        sx={{ color: 'error.light', borderColor: 'rgba(239,83,80,0.3)',
                            '&:hover': { borderColor: 'error.light', bgcolor: 'rgba(239,83,80,0.08)' } }}>
                        Sign Out
                    </Button>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button fullWidth variant="outlined" onClick={() => { onClose(); onLogin(); }}
                            sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.2)',
                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                            Login
                        </Button>
                        <Button fullWidth variant="contained" onClick={() => { onClose(); onSignUp(); }}>
                            Sign Up
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar({ user = null, sectionLinks = [] }) {
    const [loginOpen,  setLoginOpen]  = useState(false);
    const [signUpOpen, setSignUpOpen] = useState(false);
    const [anchorEl,   setAnchorEl]   = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSectionClick = (e, href) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // non-anchor links navigate normally
    };

    return (
        <>
            <Box component="nav" sx={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: { xs: 2, md: 6 }, py: 1.75,
                backdropFilter: 'blur(14px)',
                bgcolor: 'rgba(10, 25, 15, 0.88)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
                {/* Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                    <TerrainIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
                    <Typography variant="h6" fontWeight={900}
                        onClick={() => router.visit(user ? '/home' : '/')}
                        sx={{ color: 'white', fontFamily: 'Georgia, serif', letterSpacing: '-0.01em',
                            cursor: 'pointer', '&:hover': { opacity: 0.85 } }}>
                        Trek<Box component="span" sx={{ color: 'secondary.main' }}>Sathi</Box>
                    </Typography>
                </Box>

                {/* Desktop section links */}
                {sectionLinks.length > 0 && (
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mx: 'auto' }}>
                        {sectionLinks.map(link => (
                            <Box key={link.label} component="a" href={link.href}
                                onClick={e => handleSectionClick(e, link.href)}
                                sx={{
                                    px: 1.75, py: 0.5, fontSize: '0.82rem', fontWeight: 500,
                                    color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                                    borderRadius: 1.5, cursor: 'pointer',
                                    transition: 'color 0.18s, background 0.18s',
                                    '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.07)' },
                                }}>
                                {link.label}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Desktop right side */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                    {user ? (
                        <>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>{user.name}</Typography>
                            <Avatar onClick={e => setAnchorEl(e.currentTarget)}
                                sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: '0.8rem',
                                    fontWeight: 700, cursor: 'pointer', '&:hover': { opacity: 0.85 } }}>
                                {user.name?.[0]?.toUpperCase() ?? 'U'}
                            </Avatar>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
                                PaperProps={{ sx: { minWidth: 160, borderRadius: 2, mt: 0.5 } }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                                <MenuItem disabled sx={{ opacity: '1 !important' }}>
                                    <Typography variant="caption" color="text.secondary" noWrap>{user.email}</Typography>
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={() => router.post(route('logout'))} sx={{ color: 'error.main', gap: 1 }}>
                                    <LogoutIcon fontSize="small" /> Sign Out
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setLoginOpen(true)} size="small"
                                sx={{ color: 'rgba(255,255,255,0.75)', px: 2,
                                    '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.06)' } }}>
                                Login
                            </Button>
                            <Button onClick={() => setSignUpOpen(true)} variant="contained" size="small" sx={{ px: 2.5 }}>
                                Sign Up
                            </Button>
                        </>
                    )}
                </Box>

                {/* Mobile hamburger */}
                <IconButton onClick={() => setMobileOpen(true)}
                    sx={{ display: { xs: 'flex', md: 'none' }, color: 'rgba(255,255,255,0.75)' }}>
                    <MenuIcon />
                </IconButton>
            </Box>

            {/* Mobile Drawer */}
            <MobileDrawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                user={user}
                sectionLinks={sectionLinks}
                onLogin={() => setLoginOpen(true)}
                onSignUp={() => setSignUpOpen(true)}
            />

            {/* Auth modals */}
            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)}
                onSwitchToSignUp={() => setSignUpOpen(true)} />
            <SignUpModal open={signUpOpen} onClose={() => setSignUpOpen(false)}
                onSwitchToLogin={() => setLoginOpen(true)} />
        </>
    );
}
