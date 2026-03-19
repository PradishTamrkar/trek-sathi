import { Head, router, usePage } from '@inertiajs/react';
import {
    Box, Typography, Chip, Paper, Button, Divider,
    Avatar, Snackbar, Alert,
} from '@mui/material';
import ArrowBackIcon       from '@mui/icons-material/ArrowBack';
import TerrainIcon         from '@mui/icons-material/Terrain';
import CalendarMonthIcon   from '@mui/icons-material/CalendarMonth';
import DirectionsWalkIcon  from '@mui/icons-material/DirectionsWalk';
import FlightTakeoffIcon   from '@mui/icons-material/FlightTakeoff';
import ArticleIcon         from '@mui/icons-material/Article';
import ChevronRightIcon    from '@mui/icons-material/ChevronRight';
import Navbar              from '../../../Components/User/Navbar';
import Footer              from '../../../Components/User/Footer';
import { useState } from 'react';

const DIFFICULTY_COLOR = {
    easy:     { label: 'Easy',      bg: '#e8f5e9', color: '#2e7d32' },
    moderate: { label: 'Moderate',  bg: '#fff8e1', color: '#e65100' },
    hard:     { label: 'Hard',      bg: '#fce4ec', color: '#c62828' },
    hellmode: { label: 'Hell Mode', bg: '#1a0000', color: '#ff1744' },
};

function StatPill({ icon, label }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ color: 'rgba(255,255,255,0.5)', display: 'flex' }}>{icon}</Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{label}</Typography>
        </Box>
    );
}

function RouteCard({ route }) {
    const cfg = DIFFICULTY_COLOR[route.difficulty] ?? { label: route.difficulty, bg: '#f5f5f5', color: '#555' };
    const permitTotal = route.permits?.reduce((s, p) => s + (Number(p.price_in_usd) || 0), 0) ?? 0;

    return (
        <Paper
            variant="outlined"
            onClick={() => router.visit(route('trekkingRoute.show', route.id))}
            sx={{
                borderRadius: 3, overflow: 'hidden', cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { boxShadow: 4, transform: 'translateY(-2px)', borderColor: 'primary.main' },
            }}
        >
            {/* Image */}
            <Box sx={{
                height: 160, bgcolor: '#1a2e1f', position: 'relative',
                backgroundImage: route.trekking_images ? `url(${route.trekking_images})` : 'none',
                backgroundSize: 'cover', backgroundPosition: 'center',
            }}>
                {!route.trekking_images && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <TerrainIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.15)' }} />
                    </Box>
                )}
                <Chip
                    label={cfg.label}
                    size="small"
                    sx={{
                        position: 'absolute', top: 12, right: 12,
                        bgcolor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.68rem',
                    }}
                />
            </Box>

            {/* Body */}
            <Box sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom noWrap>
                    {route.trekking_route_name}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DirectionsWalkIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">{route.duration_days} days</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TerrainIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">
                            {Number(route.max_altitude).toLocaleString()}m
                        </Typography>
                    </Box>
                    {route.best_season && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarMonthIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary">{route.best_season}</Typography>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ArticleIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">
                            {route.route_days_count ?? 0} day stages
                        </Typography>
                    </Box>
                    {permitTotal > 0 && (
                        <Typography variant="caption" color="primary.main" fontWeight={700}>
                            Permits ~${permitTotal}
                        </Typography>
                    )}
                    <ChevronRightIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                </Box>
            </Box>
        </Paper>
    );
}

export default function RegionShow({ region }) {
    const { auth, flash } = usePage().props;
    const [snackbar, setSnackbar] = useState(!!flash?.success || !!flash?.failed);
    const routes = region.trekking_routes ?? [];

    return (
        <>
            <Head title={`${region.region_name} — TrekSathi`} />

            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Navbar user={auth?.user} />

                <Box sx={{ pt: '64px', flex: 1 }}>
                    {/* Hero */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #0d1f14 0%, #1a3a2f 100%)',
                        backgroundImage: region.region_images
                            ? `linear-gradient(to bottom, rgba(10,20,14,0.55) 0%, rgba(10,20,14,0.85) 100%), url(${region.region_images})`
                            : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        px: { xs: 3, md: 8 }, py: { xs: 5, md: 7 },
                    }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.visit('/home')}
                            sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, '&:hover': { color: 'white' } }}
                        >
                            Back
                        </Button>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <TerrainIcon sx={{ color: 'secondary.main', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Region
                            </Typography>
                        </Box>

                        <Typography variant="h3" fontWeight={800} sx={{ color: 'white', fontFamily: 'Georgia, serif', mb: 1 }}>
                            {region.region_name}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
                            <StatPill icon={<DirectionsWalkIcon sx={{ fontSize: 15 }} />} label={`${routes.length} trekking route${routes.length !== 1 ? 's' : ''}`} />
                            {region.best_season && (
                                <StatPill icon={<CalendarMonthIcon sx={{ fontSize: 15 }} />} label={`Best: ${region.best_season}`} />
                            )}
                        </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 5 }, py: 5 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 5 }}>

                            {/* Left */}
                            <Box>
                                {/* About */}
                                {region.region_description && (
                                    <Box sx={{ mb: 5 }}>
                                        <Typography variant="h6" fontWeight={700} gutterBottom>About this Region</Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                                            {region.region_description}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Routes */}
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Trekking Routes ({routes.length})
                                </Typography>

                                {routes.length === 0 ? (
                                    <Paper variant="outlined" sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
                                        <TerrainIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                        <Typography color="text.secondary">No routes added yet for this region.</Typography>
                                    </Paper>
                                ) : (
                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                                        gap: 2.5,
                                    }}>
                                        {routes.map(r => <RouteCard key={r.id} route={r} />)}
                                    </Box>
                                )}
                            </Box>

                            {/* Right: sidebar info */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>Quick Info</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        {region.best_season && (
                                            <Box>
                                                <Typography variant="caption" color="text.disabled">Best Season</Typography>
                                                <Typography variant="body2" fontWeight={600}>{region.best_season}</Typography>
                                            </Box>
                                        )}
                                        <Box>
                                            <Typography variant="caption" color="text.disabled">Total Routes</Typography>
                                            <Typography variant="body2" fontWeight={600}>{routes.length}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>

                                {region.how_to_reach && (
                                    <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                            <FlightTakeoffIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                            <Typography variant="subtitle2" fontWeight={700}>How to Reach</Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                            {region.how_to_reach}
                                        </Typography>
                                    </Paper>
                                )}
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
