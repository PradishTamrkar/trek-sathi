import { Head, router, usePage } from '@inertiajs/react';
import {
    Box, Typography, Chip, Paper, Button, Divider, Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import BoltIcon from '@mui/icons-material/Bolt';
import HotelIcon from '@mui/icons-material/Hotel';
import TerrainIcon from '@mui/icons-material/Terrain';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Navbar from '../../../Components/User/Navbar';
import Footer from '../../../Components/User/Footer';

//Dummy fallback
const DUMMY = {
    id: 1,
    house_name: 'Everest View Hotel',
    location: 'Namche Bazaar',
    altitude_location: 3880,
    cost_per_night: 15,
    has_wifi: true,
    has_electricity: true,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85',
    route_day: {
        id: 2,
        day_number: 2,
        start_point: 'Phakding',
        end_point: 'Namche Bazaar',
        altitude: 3440,
        trekking_route: {
            id: 1,
            trekking_route_name: 'Everest Base Camp Trek',
        },
    },
};

function AmenityBadge({ icon, label, active, activeColor = 'primary.main', activeBg = '#e8f5e9' }) {
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            p: 1.5, borderRadius: 2,
            bgcolor: active ? activeBg : 'grey.100',
            border: '1px solid', borderColor: active ? activeColor : 'transparent',
            opacity: active ? 1 : 0.5,
        }}>
            <Box sx={{ color: active ? activeColor : 'text.disabled' }}>{icon}</Box>
            <Typography variant="body2" fontWeight={active ? 600 : 400}
                color={active ? 'text.primary' : 'text.disabled'}>
                {label}
            </Typography>
            {active && (
                <Chip label="Available" size="small"
                    sx={{ ml: 'auto', fontSize: '0.6rem', height: 18,
                        bgcolor: activeBg, color: activeColor, fontWeight: 700 }} />
            )}
        </Box>
    );
}

export default function TeaHouseShow({ teaHouse }) {
    const { auth } = usePage().props;
    const data = teaHouse ?? DUMMY;
    const route = data.route_day?.trekking_route;

    return (
        <>
            <Head title={`${data.house_name} — TrekSathi`} />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Navbar user={auth?.user} />

                <Box sx={{ pt: '64px' }}>
                    {/* Hero */}
                    <Box sx={{ position: 'relative', height: { xs: 220, sm: 300, md: 380 }, bgcolor: 'grey.300', overflow: 'hidden' }}>
                        {(data.image ?? data.trekking_images) && (
                            <Box component="img"
                                src={data.image ?? data.trekking_images}
                                alt={data.house_name}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <Box sx={{ position: 'absolute', inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: { xs: 3, md: 5 } }}>
                            <Button onClick={() => router.back()} startIcon={<ArrowBackIcon />} size="small"
                                sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, px: 0, '&:hover': { color: 'white' } }}>
                                Back
                            </Button>
                            {/* Breadcrumb — route name */}
                            {route && (
                                <Typography variant="caption"
                                    onClick={() => router.visit(`/routes/${route.id}`)}
                                    sx={{ color: 'secondary.main', cursor: 'pointer', display: 'block', mb: 0.5,
                                        '&:hover': { textDecoration: 'underline' } }}>
                                    {route.trekking_route_name} · Day {data.route_day?.day_number}
                                </Typography>
                            )}
                            <Typography variant="h3" fontWeight={800}
                                sx={{ color: 'white', fontFamily: 'Georgia, serif', lineHeight: 1.1 }}>
                                {data.house_name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.75 }}>
                                {data.location}
                                {data.altitude_location && ` · ${Number(data.altitude_location).toLocaleString()}m altitude`}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 5 }, py: 5 }}>
                        <Grid container spacing={4}>

                            {/* Left — amenities + location info */}
                            <Grid item xs={12} md={7}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>Amenities</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                                    <AmenityBadge
                                        icon={data.has_wifi ? <WifiIcon /> : <WifiOffIcon />}
                                        label="WiFi"
                                        active={data.has_wifi}
                                        activeColor="#1565c0"
                                        activeBg="#e3f2fd"
                                    />
                                    <AmenityBadge
                                        icon={<BoltIcon />}
                                        label="Electricity"
                                        active={data.has_electricity}
                                        activeColor="#e65100"
                                        activeBg="#fff8e1"
                                    />
                                    <AmenityBadge
                                        icon={<HotelIcon />}
                                        label="Dormitory & Private Rooms"
                                        active={true}
                                        activeColor="#2e7d32"
                                        activeBg="#e8f5e9"
                                    />
                                </Box>

                                {/* Route day context */}
                                {data.route_day && (
                                    <>
                                        <Typography variant="h6" fontWeight={700} gutterBottom>Location on Trail</Typography>
                                        <Paper variant="outlined" sx={{ borderRadius: 2.5, p: 2.5 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                {route && (
                                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                                        <AltRouteIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                        <Box>
                                                            <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Part of Route</Typography>
                                                            <Typography
                                                                variant="body2" fontWeight={600}
                                                                onClick={() => router.visit(`/routes/${route.id}`)}
                                                                sx={{ cursor: 'pointer', color: 'primary.main',
                                                                    '&:hover': { textDecoration: 'underline' } }}>
                                                                {route.trekking_route_name}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                )}
                                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                                    <TerrainIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    <Box>
                                                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Day {data.route_day.day_number} Stop</Typography>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {data.route_day.start_point} → {data.route_day.end_point}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </>
                                )}
                            </Grid>

                            {/* Right — booking summary + CTA */}
                            <Grid item xs={12} md={5}>
                                <Paper variant="outlined" sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>Stay Details</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box>
                                            <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Location</Typography>
                                            <Typography variant="body2" fontWeight={600}>{data.location ?? '—'}</Typography>
                                        </Box>
                                        {data.altitude_location && (
                                            <Box>
                                                <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Altitude</Typography>
                                                <Typography variant="body2" fontWeight={600}>{Number(data.altitude_location).toLocaleString()}m</Typography>
                                            </Box>
                                        )}
                                        {data.cost_per_night && (
                                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#e8f5e9',
                                                border: '1px solid', borderColor: 'primary.light' }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Price per night</Typography>
                                                <Typography variant="h5" fontWeight={800} color="primary.main">
                                                    ${Number(data.cost_per_night).toFixed(0)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">Approximate — may vary seasonally</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Paper>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Button variant="contained" fullWidth startIcon={<AutoAwesomeIcon />}
                                        onClick={() => router.visit('/chat')}
                                        sx={{ py: 1.25 }}>
                                        Plan this Trek with AI
                                    </Button>
                                    {route && (
                                        <Button variant="outlined" fullWidth
                                            onClick={() => router.visit(`/routes/${route.id}`)}
                                            sx={{ py: 1.25 }}>
                                            View Full Route
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Footer />
            </Box>
        </>
    );
}
