import { Head, router } from '@inertiajs/react';
import {
    Box, Typography, Chip, Paper, Button, Divider,
    Grid,
} from '@mui/material';
import ArrowBackIcon    from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AltRouteIcon     from '@mui/icons-material/AltRoute';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import Navbar           from '../../../Components/User/Navbar';
import Footer           from '../../../Components/User/Footer';
import { usePage }      from '@inertiajs/react';

// ── Dummy fallback (remove once DB has data) ──────────────────────────────────
const DUMMY = {
    id: 1,
    region_name: 'Everest Region',
    best_season: 'Mar–May, Sep–Nov',
    region_description: 'The Everest region, also known as the Khumbu, is home to the world\'s highest peak — Mount Everest at 8,849m. The area is renowned for its dramatic landscapes, rich Sherpa culture, ancient Buddhist monasteries, and challenging high-altitude treks. Namche Bazaar serves as the gateway hub, offering acclimatisation stops, gear shops, and a vibrant trekking community.',
    how_to_reach: 'Fly from Kathmandu to Lukla (35-min flight), then trek to your destination. Alternatively, drive to Salleri and trek north. Lukla flights are weather-dependent — always build buffer days into your schedule.',
    region_images: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85',
    trekking_routes: [
        { id: 1, trekking_route_name: 'Everest Base Camp', difficulty: 'hard',     duration_days: 14, max_altitude: 5364, permit_required: true,  trekking_images: 'https://images.unsplash.com/photo-1574092526948-a41f4db8f2bf?w=600&q=80' },
        { id: 4, trekking_route_name: 'Gokyo Lakes Trek',  difficulty: 'hard',     duration_days: 12, max_altitude: 5357, permit_required: true,  trekking_images: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
        { id: 7, trekking_route_name: 'Three Passes Trek', difficulty: 'hellmode', duration_days: 20, max_altitude: 5545, permit_required: true,  trekking_images: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80' },
    ],
};

const DIFFICULTY_MAP = {
    easy:     { label: 'Easy',      bg: '#e8f5e9', color: '#2e7d32' },
    moderate: { label: 'Moderate',  bg: '#fff8e1', color: '#e65100' },
    hard:     { label: 'Hard',      bg: '#fce4ec', color: '#c62828' },
    hellmode: { label: 'Hell Mode', bg: '#1a0000', color: '#ff1744' },
};

function DifficultyChip({ level }) {
    const cfg = DIFFICULTY_MAP[level] ?? { label: level, bg: '#f5f5f5', color: '#555' };
    return (
        <Chip label={cfg.label} size="small"
            sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700, bgcolor: cfg.bg, color: cfg.color }} />
    );
}

function RouteCard({ route }) {
    const cfg = DIFFICULTY_MAP[route.difficulty] ?? { label: route.difficulty, bg: '#f5f5f5', color: '#555' };
    return (
        <Paper variant="outlined"
            onClick={() => router.visit(`/routes/${route.id}`)}
            sx={{
                borderRadius: 3, overflow: 'hidden', cursor: 'pointer',
                transition: 'all 0.18s',
                '&:hover': { borderColor: 'primary.main', transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(46,125,50,0.13)' },
            }}>
            <Box sx={{ height: 150, overflow: 'hidden', position: 'relative', bgcolor: 'grey.200' }}>
                {route.trekking_images && (
                    <Box component="img" src={route.trekking_images} alt={route.trekking_route_name}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.35s', '.MuiPaper-root:hover &': { transform: 'scale(1.06)' } }} />
                )}
                <Chip label={cfg.label} size="small"
                    sx={{ position: 'absolute', top: 8, right: 8, fontSize: '0.62rem', height: 20,
                        fontWeight: 700, bgcolor: cfg.bg, color: cfg.color }} />
            </Box>
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" fontWeight={700} noWrap gutterBottom>
                    {route.trekking_route_name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="caption" fontWeight={600}>{route.duration_days} days</Typography>
                    <Typography variant="caption" color="text.disabled">·</Typography>
                    <Typography variant="caption" fontWeight={600}>{Number(route.max_altitude).toLocaleString()}m</Typography>
                    {route.permit_required && (
                        <Chip label="Permit" size="small"
                            sx={{ fontSize: '0.6rem', height: 16, bgcolor: '#fff3e0', color: '#e65100', fontWeight: 600 }} />
                    )}
                </Box>
            </Box>
        </Paper>
    );
}

export default function RegionShow({ region }) {
    const { auth } = usePage().props;
    const data = region ?? DUMMY;

    return (
        <>
            <Head title={`${data.region_name} — TrekSathi`} />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Navbar user={auth?.user} />

                <Box sx={{ pt: '64px' }}>
                    {/* Hero image */}
                    <Box sx={{ position: 'relative', height: { xs: 240, sm: 340, md: 420 }, bgcolor: 'grey.300', overflow: 'hidden' }}>
                        {data.region_images && (
                            <Box component="img" src={data.region_images} alt={data.region_name}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        {/* Dark gradient overlay */}
                        <Box sx={{ position: 'absolute', inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
                        {/* Title on image */}
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: { xs: 3, md: 5 } }}>
                            <Button onClick={() => router.visit('/home')}
                                startIcon={<ArrowBackIcon />}
                                size="small"
                                sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, '&:hover': { color: 'white' }, px: 0 }}>
                                Back to Home
                            </Button>
                            <Typography variant="h3" fontWeight={800} sx={{ color: 'white', fontFamily: 'Georgia, serif', lineHeight: 1.1 }}>
                                {data.region_name}
                            </Typography>
                            {data.best_season && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <CalendarMonthIcon sx={{ fontSize: 15, color: 'secondary.main' }} />
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                                        Best season: {data.best_season}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 5 }, py: 5 }}>
                        <Grid container spacing={4}>

                            {/* Left — main info */}
                            <Grid item xs={12} md={7}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>About this Region</Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.85, mb: 4 }}>
                                    {data.region_description ?? 'No description available.'}
                                </Typography>

                                {data.how_to_reach && (
                                    <>
                                        <Typography variant="h6" fontWeight={700} gutterBottom>How to Reach</Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.85 }}>
                                            {data.how_to_reach}
                                        </Typography>
                                    </>
                                )}
                            </Grid>

                            {/* Right — quick facts */}
                            <Grid item xs={12} md={5}>
                                <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>Quick Facts</Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {data.best_season && (
                                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                                <CalendarMonthIcon sx={{ fontSize: 18, color: 'primary.main', mt: 0.2 }} />
                                                <Box>
                                                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Best Season</Typography>
                                                    <Typography variant="body2" fontWeight={600}>{data.best_season}</Typography>
                                                </Box>
                                            </Box>
                                        )}
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                            <AltRouteIcon sx={{ fontSize: 18, color: 'primary.main', mt: 0.2 }} />
                                            <Box>
                                                <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Trekking Routes</Typography>
                                                <Typography variant="body2" fontWeight={600}>{data.trekking_routes?.length ?? 0} routes</Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Button variant="contained" fullWidth sx={{ mt: 3 }}
                                        startIcon={<DirectionsWalkIcon />}
                                        onClick={() => {
                                            router.visit('/home');
                                            setTimeout(() => document.getElementById('find-your-route')
                                                ?.scrollIntoView({ behavior: 'smooth' }), 300);
                                        }}>
                                        Plan a Trek Here
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Routes in this region */}
                        {data.trekking_routes?.length > 0 && (
                            <Box sx={{ mt: 6 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                                    Trekking Routes in {data.region_name}
                                </Typography>
                                <Grid container spacing={2}>
                                    {data.trekking_routes.map(r => (
                                        <Grid item xs={12} sm={6} md={4} key={r.id}>
                                            <RouteCard route={r} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Box>

                <Footer />
            </Box>
        </>
    );
}
