import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Box, Typography, TextField, Button, Paper, Divider,
    Alert, Snackbar, CircularProgress, Chip, Grid,
    InputAdornment,
} from '@mui/material';
import PersonOutlineIcon     from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon     from '@mui/icons-material/EmailOutlined';
import TopicOutlinedIcon     from '@mui/icons-material/TopicOutlined';
import MessageOutlinedIcon   from '@mui/icons-material/MessageOutlined';
import SendIcon              from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WhatsAppIcon          from '@mui/icons-material/WhatsApp';
import EmailIcon             from '@mui/icons-material/Email';
import LocationOnIcon        from '@mui/icons-material/LocationOn';
import AccessTimeIcon        from '@mui/icons-material/AccessTime';
import TerrainIcon           from '@mui/icons-material/Terrain';
import Navbar                from '../../../Components/User/Navbar';
import Footer                from '../../../Components/User/Footer';

// ── Topic suggestions ─────────────────────────────────────────────────────────
const TOPICS = [
    'Trek Planning',
    'Permit Information',
    'Tea House Booking',
    'AI Planner Help',
    'Route Conditions',
    'General Inquiry',
];

// ── Contact info cards ────────────────────────────────────────────────────────
const CONTACT_INFO = [
    {
        icon: <EmailIcon />,
        label: 'Email',
        value: 'hello@treksathi.com',
        sub: 'We reply within 24 hours',
        color: '#1565c0',
        bg: '#e3f2fd',
    },
    {
        icon: <WhatsAppIcon />,
        label: 'WhatsApp',
        value: '+977 98XX XXX XXX',
        sub: 'Mon – Sat, 9 AM – 6 PM NPT',
        color: '#2e7d32',
        bg: '#e8f5e9',
    },
    {
        icon: <LocationOnIcon />,
        label: 'Based in',
        value: 'Kathmandu, Nepal',
        sub: 'Serving trekkers worldwide',
        color: '#c62828',
        bg: '#fce4ec',
    },
    {
        icon: <AccessTimeIcon />,
        label: 'Response Time',
        value: 'Under 24 hours',
        sub: 'Usually much faster',
        color: '#e65100',
        bg: '#fff8e1',
    },
];

// ── Mountain decoration SVG ───────────────────────────────────────────────────
function MountainSvg() {
    return (
        <Box component="svg" viewBox="0 0 500 200" fill="none"
            sx={{ width: '100%', opacity: 0.18, display: 'block' }}>
            <path d="M0 200L0 140L60 108L120 130L195 68L270 110L340 45L410 85L460 60L500 72L500 200Z"
                fill="#4caf50" />
            <path d="M0 200L0 158L80 118L160 145L230 95L310 125L380 70L450 100L500 85L500 200Z"
                fill="#2e7d32" />
            {/* Snow caps */}
            <path d="M340 45L354 68L366 61L378 76L362 84L346 73L330 83L314 76L326 61L338 68Z"
                fill="white" opacity=".6" />
        </Box>
    );
}

// ── Success state ─────────────────────────────────────────────────────────────
function SuccessView({ onReset }) {
    return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box sx={{
                width: 72, height: 72, borderRadius: '50%',
                bgcolor: '#e8f5e9', mx: 'auto', mb: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                Message Sent!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 340, mx: 'auto' }}>
                Thanks for reaching out. We'll get back to you within 24 hours.
            </Typography>
            <Button variant="outlined" onClick={onReset}>
                Send Another Message
            </Button>
        </Box>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ContactIndex() {
    const { auth, flash } = usePage().props;
    const [sent,        setSent]        = useState(false);
    const [snackbar,    setSnackbar]    = useState(!!flash?.success);
    const [errSnackbar, setErrSnackbar] = useState(!!flash?.failed);

    const { data, setData, post, processing, errors, reset } = useForm({
        contact_name:  auth?.user?.name  ?? '',
        contact_email: auth?.user?.email ?? '',
        topic:         '',
        message:       '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => { reset('topic', 'message'); setSent(true); },
        });
    };

    return (
        <>
            <Head title="Contact Us — TrekSathi" />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Navbar user={auth?.user} />

                {/* ── Hero ── */}
                <Box sx={{
                    pt: '64px',
                    background: 'linear-gradient(160deg, #0d1f14 0%, #1a3a2f 60%, #2d5a3d 100%)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Stars */}
                    <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `
                        radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,.7) 0%, transparent 100%),
                        radial-gradient(1.5px 1.5px at 30% 10%, rgba(255,255,255,1) 0%, transparent 100%),
                        radial-gradient(1px 1px at 65% 15%, rgba(255,255,255,.6) 0%, transparent 100%),
                        radial-gradient(1px 1px at 82% 25%, rgba(255,255,255,.5) 0%, transparent 100%)`,
                    }} />

                    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 3, md: 6 }, pt: 6, pb: 0, position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <TerrainIcon sx={{ color: 'secondary.main', fontSize: 18 }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Get in Touch
                            </Typography>
                        </Box>
                        <Typography variant="h3" fontWeight={800}
                            sx={{ color: 'white', fontFamily: 'Georgia, serif', lineHeight: 1.1, mb: 1.5 }}>
                            We're Here to Help
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 460, lineHeight: 1.8 }}>
                            Questions about routes, permits, or planning your dream Nepal trek?
                            Drop us a message and our team will get back to you quickly.
                        </Typography>
                    </Box>
                    <MountainSvg />
                </Box>

                {/* ── Content ── */}
                <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 6 }, py: 5, width: '100%' }}>
                    <Grid container spacing={4}>

                        {/* ── Left — contact info ── */}
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" fontWeight={700} color="text.secondary"
                                sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2.5 }}>
                                Contact Info
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                                {CONTACT_INFO.map(item => (
                                    <Box key={item.label} sx={{
                                        display: 'flex', gap: 2, alignItems: 'flex-start',
                                        p: 2, borderRadius: 2.5,
                                        border: '1px solid', borderColor: 'grey.200',
                                        bgcolor: 'white',
                                    }}>
                                        <Box sx={{
                                            width: 38, height: 38, borderRadius: 2, flexShrink: 0,
                                            bgcolor: item.bg, color: item.color,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {item.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.disabled"
                                                sx={{ display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                {item.label}
                                            </Typography>
                                            <Typography variant="body2" fontWeight={700}>{item.value}</Typography>
                                            <Typography variant="caption" color="text.secondary">{item.sub}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            {/* FAQ note */}
                            <Paper variant="outlined" sx={{
                                p: 2.5, borderRadius: 3,
                                bgcolor: '#f9fff9', borderColor: '#c8e6c9',
                            }}>
                                <Typography variant="body2" fontWeight={700} color="primary.dark" gutterBottom>
                                    🏔️ Before You Write
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.8, display: 'block' }}>
                                    Our AI trip planner can answer most trekking questions instantly —
                                    permits, routes, altitude, seasons. Try it first!
                                </Typography>
                                <Button size="small" href="/chat" variant="outlined" sx={{ mt: 1.5, fontSize: '0.75rem' }}>
                                    Ask the AI
                                </Button>
                            </Paper>
                        </Grid>

                        {/* ── Right — form ── */}
                        <Grid item xs={12} md={8}>
                            <Paper variant="outlined" sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>

                                {sent ? (
                                    <SuccessView onReset={() => setSent(false)} />
                                ) : (
                                    <>
                                        <Typography variant="h6" fontWeight={700} gutterBottom>
                                            Send a Message
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Fill out the form below and we'll get back to you within 24 hours.
                                        </Typography>

                                        <Box component="form" onSubmit={handleSubmit}
                                            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                                            {/* Name + Email row */}
                                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                                <TextField
                                                    label="Your Name"
                                                    value={data.contact_name}
                                                    onChange={e => setData('contact_name', e.target.value)}
                                                    error={!!errors.contact_name}
                                                    helperText={errors.contact_name}
                                                    required
                                                    placeholder="e.g. Ram Sharma"
                                                    InputProps={{ startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonOutlineIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                                                        </InputAdornment>
                                                    )}}
                                                />
                                                <TextField
                                                    label="Email Address"
                                                    type="email"
                                                    value={data.contact_email}
                                                    onChange={e => setData('contact_email', e.target.value)}
                                                    error={!!errors.contact_email}
                                                    helperText={errors.contact_email}
                                                    required
                                                    placeholder="you@example.com"
                                                    InputProps={{ startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                                                        </InputAdornment>
                                                    )}}
                                                />
                                            </Box>

                                            {/* Topic field + quick-select chips */}
                                            <Box>
                                                <TextField
                                                    label="Topic"
                                                    value={data.topic}
                                                    onChange={e => setData('topic', e.target.value)}
                                                    error={!!errors.topic}
                                                    helperText={errors.topic}
                                                    required
                                                    placeholder="What's this about?"
                                                    InputProps={{ startAdornment: (
                                                        <InputAdornment position="start">
                                                            <TopicOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                                                        </InputAdornment>
                                                    )}}
                                                />
                                                {/* Quick-select topic chips */}
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                                                    {TOPICS.map(t => (
                                                        <Chip
                                                            key={t}
                                                            label={t}
                                                            size="small"
                                                            onClick={() => setData('topic', t)}
                                                            variant={data.topic === t ? 'filled' : 'outlined'}
                                                            sx={{
                                                                fontSize: '0.7rem',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s',
                                                                ...(data.topic === t
                                                                    ? { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }
                                                                    : { '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }
                                                                ),
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>

                                            {/* Message */}
                                            <TextField
                                                label="Your Message"
                                                value={data.message}
                                                onChange={e => setData('message', e.target.value)}
                                                error={!!errors.message}
                                                helperText={errors.message || `${data.message.length}/2000 characters`}
                                                required
                                                multiline
                                                rows={5}
                                                placeholder="Tell us what you need — the more detail the better!"
                                                inputProps={{ maxLength: 2000 }}
                                                InputProps={{ startAdornment: (
                                                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                                        <MessageOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                                                    </InputAdornment>
                                                )}}
                                            />

                                            <Divider />

                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                                <Typography variant="caption" color="text.disabled">
                                                    We typically reply within a few hours.
                                                </Typography>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    size="large"
                                                    disabled={processing}
                                                    endIcon={processing ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                                                    sx={{ px: 4, py: 1.25 }}
                                                >
                                                    {processing ? 'Sending…' : 'Send Message'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                <Footer />
            </Box>

            {/* Flash snackbars */}
            <Snackbar open={snackbar} autoHideDuration={4000} onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="success" onClose={() => setSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {flash?.success}
                </Alert>
            </Snackbar>
            <Snackbar open={errSnackbar} autoHideDuration={5000} onClose={() => setErrSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="error" onClose={() => setErrSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {flash?.failed}
                </Alert>
            </Snackbar>
        </>
    );
}
