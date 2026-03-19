import { Head, router, usePage } from '@inertiajs/react';
import {
    Box, Typography, Chip, Paper, Button, Divider,
    Snackbar, Alert,
} from '@mui/material';
import ArrowBackIcon       from '@mui/icons-material/ArrowBack';
import HouseIcon           from '@mui/icons-material/House';
import TerrainIcon         from '@mui/icons-material/Terrain';
import AttachMoneyIcon     from '@mui/icons-material/AttachMoney';
import WifiIcon            from '@mui/icons-material/Wifi';
import LocalDiningIcon     from '@mui/icons-material/LocalDining';
import BedIcon             from '@mui/icons-material/Bed';
import DirectionsWalkIcon  from '@mui/icons-material/DirectionsWalk';
import ChevronRightIcon    from '@mui/icons-material/ChevronRight';
import Navbar              from '../../../Components/User/Navbar';
import Footer              from '../../../Components/User/Footer';
import { useState } from 'react';

function AmenityBadge({ icon, label, available }) {
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            p: 1.5, borderRadius: 2,
            bgcolor: available ? '#e8f5e9' : '#f5f5f5',
            border: '1px solid', borderColor: available ? '#c8e6c9' : '#e0e0e0',
        }}>
            <Box sx={{ color: available ? 'primary.main' : 'text.disabled', display: 'flex' }}>{icon}</Box>
            <Typography variant="caption" fontWeight={600} color={available ? 'primary.dark' : 'text.disabled'}>
                {label}
            </Typography>
        </Box>
    );
}

export default function TeaHouseShow({ teaHouse }) {
    const { auth, flash } = usePage().props;
    const [snackbar, setSnackbar] = useState(!!flash?.success || !!flash?.failed);

    const route       = teaHouse.trekking_route;
    const region      = route?.regions;

    return (
        <>
            <Head title={`${teaHouse.house_name} — TrekSathi`} />

            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Navbar user={auth?.user} />

                <Box sx={{ pt: '64px', flex: 1 }}>
                    {/* Hero */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #1a2e1f 0%, #0d1f14 100%)',
                        backgroundImage: teaHouse.tea_house_images
                            ? `linear-gradient(to bottom, rgba(10,20,14,0.45) 0%, rgba(10,20,14,0.88) 100%), url(${teaHouse.tea_house_images})`
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

                        {/* Breadcrumb */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                            {region && (
                                <>
                                    <Typography variant="caption"
                                        onClick={() => router.visit(route('regions.show', region.id))}
                                        sx={{ color: 'secondary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                        {region.region_name}
                                    </Typography>
                                    <ChevronRightIcon sx={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }} />
                                </>
                            )}
                            {route && (
                                <>
                                    <Typography variant="caption"
                                        onClick={() => router.visit(route('trekkingRoute.show', route.id))}
                                        sx={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}>
                                        {route.trekking_route_name}
                                    </Typography>
                                    <ChevronRightIcon sx={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }} />
                                </>
                            )}

                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <HouseIcon sx={{ color: 'secondary.main', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Tea House
                            </Typography>
                        </Box>

                        <Typography variant="h3" fontWeight={800}
                            sx={{ color: 'white', fontFamily: 'Georgia, serif', mb: 2 }}>
                            {teaHouse.house_name}
                        </Typography>

                        {/* Price badge */}
                        {teaHouse.cost_per_night && (
                            <Chip
                                icon={<AttachMoneyIcon sx={{ fontSize: '14px !important', color: 'secondary.main !important' }} />}
                                label={`$${teaHouse.cost_per_night} / night`}
                                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 700, backdropFilter: 'blur(4px)' }}
                            />
                        )}
                    </Box>

                    {/* Body */}
                    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 5 }, py: 5 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' }, gap: 5 }}>

                            {/* LEFT */}
                            <Box>
                                {teaHouse.description && (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h6" fontWeight={700} gutterBottom>About</Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                                            {teaHouse.description}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Amenities */}
                                <Box>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>Amenities</Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                                        <AmenityBadge icon={<BedIcon sx={{ fontSize: 16 }} />}       label="Dormitory / Rooms" available />
                                        <AmenityBadge icon={<LocalDiningIcon sx={{ fontSize: 16 }} />} label="Meals Served"     available />
                                        <AmenityBadge icon={<WifiIcon sx={{ fontSize: 16 }} />}      label="WiFi"
                                            available={Boolean(teaHouse.has_wifi)} />
                                        <AmenityBadge icon={<AttachMoneyIcon sx={{ fontSize: 16 }} />} label="Charging Station"
                                            available={Boolean(teaHouse.has_charging)} />
                                    </Box>
                                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1.5 }}>
                                        * Amenity availability may vary by season. Confirm on arrival.
                                    </Typography>
                                </Box>
                            </Box>

                            {/* RIGHT */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Pricing */}
                                <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>Pricing</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    {teaHouse.cost_per_night ? (
                                        <>
                                            <Typography variant="h5" fontWeight={800} color="primary.main">
                                                ${teaHouse.cost_per_night}
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled">per night / person</Typography>
                                        </>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">Price not listed</Typography>
                                    )}
                                </Paper>

                                {/* Route link */}
                                {route && (
                                    <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                            <TerrainIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                            <Typography variant="subtitle2" fontWeight={700}>On the Trail</Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {region && (
                                                <Box>
                                                    <Typography variant="caption" color="text.disabled">Region</Typography>
                                                    <Typography variant="body2" fontWeight={600}>{region.region_name}</Typography>
                                                </Box>
                                            )}
                                            <Box>
                                                <Typography variant="caption" color="text.disabled">Route</Typography>
                                                <Typography variant="body2" fontWeight={600}>{route.trekking_route_name}</Typography>
                                            </Box>
                                        </Box>
                                        <Button
                                            variant="outlined" size="small" fullWidth
                                            startIcon={<DirectionsWalkIcon />}
                                            onClick={() => router.visit(route('trekkingRoute.show', route.id))}
                                            sx={{ mt: 2 }}
                                        >
                                            View Full Route
                                        </Button>
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
