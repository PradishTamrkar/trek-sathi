import { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import {
    Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, Divider, TextField, Chip, Alert, Snackbar, Grid,
    FormControl, InputLabel, Select, MenuItem, FormHelperText,
    Avatar, Card, CardContent,
} from '@mui/material';
import AddIcon            from '@mui/icons-material/Add';
import TerrainIcon        from '@mui/icons-material/Terrain';
import CheckCircleIcon    from '@mui/icons-material/CheckCircle';
import WarningAmberIcon   from '@mui/icons-material/WarningAmber';
import CancelIcon         from '@mui/icons-material/Cancel';
import ArrowBackIcon      from '@mui/icons-material/ArrowBack';
import GroupsIcon         from '@mui/icons-material/Groups';
import Navbar             from '../../../Components/User/Navbar';
import Footer             from '../../../Components/User/Footer';
import UserSidebar, { SIDEBAR_W } from '../../../Components/User/UserSidebar';
import { useTheme, useMediaQuery } from '@mui/material'

//Trial condition config
const CONDITION_MAP = {
    good:    { label: 'Good',    icon: <CheckCircleIcon />,  bg: '#e8f5e9', color: '#2e7d32' },
    damaged: { label: 'Damaged', icon: <WarningAmberIcon />, bg: '#fff8e1', color: '#e65100' },
    closed:  { label: 'Closed',  icon: <CancelIcon />,       bg: '#fce4ec', color: '#c62828' },
};

function TrailBadge({condition}){
    const cfg=CONDITION_MAP[condition] ?? {label:condition, bg:'#f5f5f5', color: '#555'};
    return (
        <Chip
            icon={<Box sx={{ color: `${cfg.color} !important`, display: 'flex' }}>{cfg.icon}</Box>}
            label={cfg.label}
            size="small"
            sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.72rem', height: 24 }}
        />
    );
}

//Submit dialog
function SubmitDialog({ open, onClose, routes }){
    const { data, setData, post, processing, errors, reset } = useForm({
        trekking_route_id: '',
        experience_text:   '',
        trail_condition:   '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('submissions.store'),{
            onSuccess: () => { reset(); onClose(); },
        });
    };

    const handleClose = () => { reset(); onClose();};

    return (
       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" fontWeight={700}>Share Your Trail Report</Typography>
                <Typography variant="caption" color="text.secondary">
                    Help other trekkers by sharing your experience. Reports are reviewed before publishing.
                </Typography>
            </DialogTitle>
            <Divider />
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>

                    <FormControl fullWidth size="small" error={!!errors.trekking_route_id} required>
                        <InputLabel>Trekking Route</InputLabel>
                        <Select
                            label="Trekking Route"
                            value={data.trekking_route_id}
                            onChange={e => setData('trekking_route_id', e.target.value)}>
                            {routes.map(r => (
                                <MenuItem key={r.id} value={r.id}>{r.trekking_route_name}</MenuItem>
                            ))}
                        </Select>
                        {errors.trekking_route_id && <FormHelperText>{errors.trekking_route_id}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth size="small" error={!!errors.trail_condition} required>
                        <InputLabel>Trail Condition</InputLabel>
                        <Select
                            label="Trail Condition"
                            value={data.trail_condition}
                            onChange={e => setData('trail_condition', e.target.value)}>
                            {Object.entries(CONDITION_MAP).map(([val, cfg]) => (
                                <MenuItem key={val} value={val}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ color: cfg.color, display: 'flex' }}>{cfg.icon}</Box>
                                        {cfg.label}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.trail_condition && <FormHelperText>{errors.trail_condition}</FormHelperText>}
                    </FormControl>

                    <TextField
                        label="Your Experience"
                        value={data.experience_text}
                        onChange={e => setData('experience_text', e.target.value)}
                        error={!!errors.experience_text}
                        helperText={errors.experience_text || `${data.experience_text.length}/3000 characters`}
                        multiline
                        rows={5}
                        required
                        placeholder="Describe the trail conditions, what you encountered, tips for other trekkers, dates you trekked..."
                        inputProps={{ maxLength: 3000 }}
                    />

                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                        Your report will be reviewed by our team before it appears publicly. Usually within 24 hours.
                    </Alert>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button onClick={handleClose} color="inherit" disabled={processing}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={processing}>
                        {processing ? 'Submitting…' : 'Submit Report'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

//Submission card
function SubmissionCard({submission}){
    const [expanded,setExpanded]=useState(false);
    const text=submission.experience_text;
    const isLong=text.length > 200;

    function nameToColor(name){
        let hash = 0;
        for (let i = 0; i< name.length; i++)
        {
            hash = name.charCodeAt(i)+((hash << 5)-hash);
        }
        return `hsl(${Math.abs(hash) % 360}, 45%, 45%)`;
    }

    const name = submission.user?.name ?? 'Anonymous';

    return (
        <Paper variant="outlined" sx={{ borderRadius: 3, p: 3, height: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: nameToColor(name), fontSize: '0.85rem', fontWeight: 700 }}>
                        {name[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight={700}>{name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(submission.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                    </Box>
                </Box>
                <TrailBadge condition={submission.trail_condition} />
            </Box>

            {/* Route */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
                <TerrainIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                <Typography variant="caption" color="primary.main" fontWeight={600}>
                    {submission.trekking_route?.trekking_route_name ?? '—'}
                </Typography>
            </Box>

            {/* Experience */}
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                {expanded || !isLong ? text : `${text.slice(0, 280)}…`}
            </Typography>
            {isLong && (
                <Button size="small" onClick={() => setExpanded(e => !e)}
                    sx={{ mt: 1, p: 0, minWidth: 0, color: 'primary.main', fontSize: '0.75rem' }}>
                    {expanded ? 'Show less' : 'Read more'}
                </Button>
            )}
        </Paper>
    );
}

//Main Page
export default function CommunitySubmissionsIndex({ submissions=[], routes=[]}){
    const { auth, flash}=usePage().props;
    const user=auth?.user;
    const theme=useTheme();
    const isMobile=useMediaQuery(theme.breakpoints.down('sm'));

    const [sidebarOpen,setSidebarOpen]=useState(true);
    const [dialogOpen,setDialogOpen]=useState(false);
    const [snackbar,setSnackbar]=useState(!!flash?.success);
    const [errSnackbar,setErrSnackbar]=useState(!!flash?.failed);

    const goodCount    = submissions.filter(s => s.trail_condition === 'good').length;
    const damagedCount = submissions.filter(s => s.trail_condition === 'damaged').length;
    const closedCount  = submissions.filter(s => s.trail_condition === 'closed').length;

    return (
         <>
            <Head title="Community Reports — TrekSathi" />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Navbar user={user} />

                <Box sx={{ display: 'flex', flex: 1, pt: '64px' }}>
                    <UserSidebar open={!isMobile && sidebarOpen} activePage="community" />

                    <Box sx={{
                        flex: 1, minWidth: 0,
                        ml: (!isMobile && sidebarOpen) ? `${SIDEBAR_W}px` : 0,
                        transition: 'margin-left 0.25s ease',
                    }}>
                        {/* Hero */}
                        <Box sx={{
                            background: 'linear-gradient(135deg, #0d1f14 0%, #1a3a2f 60%, #2d5a3d 100%)',
                            px: { xs: 3, md: 6 }, py: 5, position: 'relative', overflow: 'hidden',
                        }}>
                            <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `
                                radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,.7) 0%, transparent 100%),
                                radial-gradient(1.5px 1.5px at 45% 10%, rgba(255,255,255,1) 0%, transparent 100%),
                                radial-gradient(1px 1px at 75% 18%, rgba(255,255,255,.6) 0%, transparent 100%)`,
                            }} />
                            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
                                <Button startIcon={<ArrowBackIcon />} onClick={() => router.visit('/home')}
                                    sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, pl: 0,
                                        '&:hover': { color: 'white' } }}>
                                    Back to Home
                                </Button>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                    <GroupsIcon sx={{ color: 'secondary.main', fontSize: 18 }} />
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)',
                                        textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        Community
                                    </Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={800}
                                    sx={{ color: 'white', fontFamily: 'Georgia, serif', mb: 1.5 }}>
                                    Trail Reports
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, lineHeight: 1.8 }}>
                                    Real-time trail conditions from trekkers who've been there recently.
                                    Help the community by sharing your own experience.
                                </Typography>

                                {/* Stats row */}
                                <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', mb: 3 }}>
                                    {[
                                        { label: 'Good', count: goodCount,    bg: '#e8f5e9', color: '#2e7d32' },
                                        { label: 'Damaged', count: damagedCount, bg: '#fff8e1', color: '#e65100' },
                                        { label: 'Closed', count: closedCount,  bg: '#fce4ec', color: '#c62828' },
                                    ].map(s => (
                                        <Box key={s.label} sx={{
                                            px: 2, py: 1, borderRadius: 2,
                                            bgcolor: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                        }}>
                                            <Typography variant="h6" fontWeight={800} sx={{ color: s.color, lineHeight: 1 }}>
                                                {s.count}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                                {s.label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {user && (
                                    <Button variant="contained" startIcon={<AddIcon />}
                                        onClick={() => setDialogOpen(true)}
                                        sx={{ px: 3 }}>
                                        Share Your Report
                                    </Button>
                                )}
                                {!user && (
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                        Sign in to share your trail experience with the community.
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        {/* Submissions grid */}
                        <Box sx={{ px: { xs: 2, md: 6 }, py: 5 }}>
                            {submissions.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 10 }}>
                                    <GroupsIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
                                        No reports yet
                                    </Typography>
                                    <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                                        Be the first to share a trail condition report!
                                    </Typography>
                                    {user && (
                                        <Button variant="contained" startIcon={<AddIcon />}
                                            onClick={() => setDialogOpen(true)}>
                                            Share Your Report
                                        </Button>
                                    )}
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {submissions.map(s => (
                                        <Grid item xs={12} sm={6} lg={4} key={s.id}>
                                            <SubmissionCard submission={s} />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ ml: (!isMobile && sidebarOpen) ? `${SIDEBAR_W}px` : 0, transition: 'margin-left 0.25s ease' }}>
                    <Footer />
                </Box>
            </Box>

            <SubmitDialog open={dialogOpen} onClose={() => setDialogOpen(false)} routes={routes} />

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
