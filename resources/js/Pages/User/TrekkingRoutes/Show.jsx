import { Head, router, usePage } from '@inertiajs/react';
import {
    Box, Typography, Chip, Paper, Button, Divider,
    Snackbar, Alert, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ArrowBackIcon       from '@mui/icons-material/ArrowBack';
import TerrainIcon         from '@mui/icons-material/Terrain';
import CalendarMonthIcon   from '@mui/icons-material/CalendarMonth';
import DirectionsWalkIcon  from '@mui/icons-material/DirectionsWalk';
import ArticleIcon         from '@mui/icons-material/Article';
import HouseIcon           from '@mui/icons-material/House';
import ExpandMoreIcon      from '@mui/icons-material/ExpandMore';
import CheckCircleIcon     from '@mui/icons-material/CheckCircle';
import TimerIcon           from '@mui/icons-material/Timer';
import SmartToyIcon        from '@mui/icons-material/SmartToy';
import Navbar              from '../../../Components/User/Navbar';
import Footer              from '../../../Components/User/Footer';
import { useState } from 'react';

const DIFFICULTY_COLOR = {
    easy:     { label: 'Easy',      bg: '#e8f5e9', color: '#2e7d32' },
    moderate: { label: 'Moderate',  bg: '#fff8e1', color: '#e65100' },
    hard:     { label: 'Hard',      bg: '#fce4ec', color: '#c62828' },
    hellmode: { label: 'Hell Mode', bg: '#1a0000', color: '#ff1744' },
};

export default function TrekkingRouteShow({ trekkingRoute }) {
    const { auth, flash } = usePage().props;
    const [snackbar, setSnackbar] = useState(!!flash?.success || !!flash?.failed);

    const cfg = DIFFICULTY_COLOR[trekkingRoute.difficulty] ?? {
        label: trekkingRoute.difficulty, bg: '#f5f5f5', color: '#555'
    };
    const days    = trekkingRoute.route_days    ?? [];
    const permits = trekkingRoute.permits       ?? [];
    const permitTotal = permits.reduce((s, p) => s + (Number(p.price_in_usd) || 0), 0);

    return (
        <>
            <Head title={`${trekkingRoute.trekking_route_name} — TrekSathi`} />

            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Navbar user={auth?.user} />

                <Box sx={{ pt: '64px', flex: 1 }}>
                    {/* Hero */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #0d1f14 0%, #1a3a2f 100%)',
                        backgroundImage: trekkingRoute.trekking_images
                            ? `linear-gradient(to bottom, rgba(10,20,14,0.5) 0%, rgba(10,20,14,0.88) 100%), url(${trekkingRoute.trekking_images})`
                            : undefined,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        px: { xs: 3, md: 8 }, py: { xs: 5, md: 7 },
                    }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => history.back()}
                            sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, '&:hover': { color: 'white' } }}
                        >
                            Back
                        </Button>

                        {trekkingRoute.regions && (
                            <Typography
                                variant="caption"
                                onClick={() => router.visit(route('regions.show', trekkingRoute.regions.id))}
                                sx={{
                                    color: 'secondary.main', cursor: 'pointer', display: 'block', mb: 1,
                                    textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem',
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                {trekkingRoute.regions.region_name}
                            </Typography>
                        )}

                        <Typography variant="h3" fontWeight={800}
                            sx={{ color: 'white', fontFamily: 'Georgia, serif', mb: 2 }}>
                            {trekkingRoute.trekking_route_name}
                        </Typography>

                        {/* Stats row */}
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                            {[
                                { icon: <TimerIcon sx={{ fontSize: 15 }} />,        label: `${trekkingRoute.duration_days} days` },
                                { icon: <TerrainIcon sx={{ fontSize: 15 }} />,       label: `${Number(trekkingRoute.max_altitude).toLocaleString()}m altitude` },
                                { icon: <CalendarMonthIcon sx={{ fontSize: 15 }} />, label: trekkingRoute.best_season },
                            ].map((s, i) => s.label && (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    <Box sx={{ color: 'rgba(255,255,255,0.5)' }}>{s.icon}</Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{s.label}</Typography>
                                </Box>
                            ))}
                            <Chip label={cfg.label} size="small"
                                sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
                        </Box>
                    </Box>

                    {/* Body */}
                    <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 5 }, py: 5 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 5 }}>

                            {/* LEFT: description + itinerary */}
                            <Box>
                                {trekkingRoute.trekking_description && (
                                    <Box sx={{ mb: 5 }}>
                                        <Typography variant="h6" fontWeight={700} gutterBottom>About this Trek</Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                                            {trekkingRoute.trekking_description}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Day-by-day */}
                                {days.length > 0 && (
                                    <Box>
                                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                            Day-by-Day Itinerary
                                        </Typography>
                                        {days.map((day, idx) => (
                                            <Accordion key={day.id} disableGutters elevation={0}
                                                sx={{
                                                    border: '1px solid', borderColor: 'divider',
                                                    borderRadius: '12px !important', mb: 1.5,
                                                    '&:before': { display: 'none' },
                                                    overflow: 'hidden',
                                                }}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                                        <Box sx={{
                                                            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                                                            bgcolor: 'primary.main', color: 'white',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '0.82rem', fontWeight: 700,
                                                        }}>
                                                            {day.day_number ?? idx + 1}
                                                        </Box>
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography variant="body2" fontWeight={700} noWrap>
                                                                {day.start_point} → {day.end_point}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 1.5, mt: 0.25 }}>
                                                                {day.Distance_in_km && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {day.Distance_in_km} km
                                                                    </Typography>
                                                                )}
                                                                {day.altitude && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {Number(day.altitude).toLocaleString()}m
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails sx={{ pt: 0, pb: 2.5, px: 2.5 }}>
                                                    {day.days_description && (
                                                        <Typography variant="body2" color="text.secondary"
                                                            sx={{ lineHeight: 1.8, mb: day.tea_houses?.length ? 2 : 0 }}>
                                                            {day.days_description}
                                                        </Typography>
                                                    )}
                                                    {day.tea_houses?.length > 0 && (
                                                        <Box>
                                                            <Typography variant="caption" color="text.disabled"
                                                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
                                                                <HouseIcon sx={{ fontSize: 13 }} /> Accommodation options
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                {day.tea_houses.map(h => (
                                                                    <Chip
                                                                        key={h.id}
                                                                        label={`${h.house_name}${h.cost_per_night ? ` · $${h.cost_per_night}/night` : ''}`}
                                                                        size="small"
                                                                        onClick={() => router.visit(route('teaHouse.show', h.id))}
                                                                        sx={{
                                                                            fontSize: '0.68rem', height: 24,
                                                                            bgcolor: '#f5f5f5', cursor: 'pointer',
                                                                            '&:hover': { bgcolor: '#e8f5e9', color: 'primary.main' },
                                                                        }}
                                                                    />
                                                                ))}
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </Box>
                                )}
                            </Box>

                            {/* RIGHT: summary + permits + AI CTA */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Summary card */}
                                <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>Trip Summary</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        {[
                                            ['Duration',     `${trekkingRoute.duration_days} days`],
                                            ['Max Altitude', `${Number(trekkingRoute.max_altitude).toLocaleString()} m`],
                                            ['Best Season',  trekkingRoute.best_season],
                                            ['Difficulty',   cfg.label],
                                            ['Stages',       `${days.length} day stages`],
                                        ].filter(([, v]) => v).map(([k, v]) => (
                                            <Box key={k}>
                                                <Typography variant="caption" color="text.disabled">{k}</Typography>
                                                <Typography variant="body2" fontWeight={600}>{v}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>

                                {/* Permits */}
                                {permits.length > 0 && (
                                    <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                            <ArticleIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                            <Typography variant="subtitle2" fontWeight={700}>Permits Required</Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        {permits.map(p => (
                                            <Box key={p.id} sx={{
                                                display: 'flex', justifyContent: 'space-between',
                                                alignItems: 'center', py: 1,
                                                borderBottom: '1px solid', borderColor: 'divider',
                                                '&:last-child': { borderBottom: 'none' },
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                    <CheckCircleIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                                                    <Typography variant="caption">{p.permit_name}</Typography>
                                                </Box>
                                                <Typography variant="caption" fontWeight={700} color="primary.main">
                                                    {p.price_in_usd ? `$${p.price_in_usd}` : 'Free'}
                                                </Typography>
                                            </Box>
                                        ))}
                                        {permits.length > 1 && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5 }}>
                                                <Typography variant="caption" fontWeight={700}>Total</Typography>
                                                <Typography variant="caption" fontWeight={700} color="primary.main">
                                                    ${permitTotal}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Paper>
                                )}

                                {/* AI CTA */}
                                <Paper sx={{
                                    borderRadius: 3, p: 3,
                                    background: 'linear-gradient(135deg, #1a3a2f 0%, #0d2018 100%)',
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <SmartToyIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'white' }}>
                                            Plan with AI
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 2 }}>
                                        Get a personalised itinerary, packing list, and budget estimate for this trek.
                                    </Typography>
                                    <Button
                                        variant="contained" fullWidth size="small"
                                        onClick={() => router.visit('/chat')}
                                        startIcon={<DirectionsWalkIcon />}
                                    >
                                        Start Planning
                                    </Button>
                                </Paper>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Footer />
            </Box>

            <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity={flash?.failed ? 'error' : 'success'} onClose={() => setSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {flash?.success ?? flash?.failed}
                </Alert>
            </Snackbar>
        </>
    );
}
