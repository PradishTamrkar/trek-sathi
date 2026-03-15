import { Head, router, usePage } from '@inertiajs/react';
import {
    Box, Typography, Chip, Paper, Button, Divider,
    Grid, Stepper, Step, StepLabel, StepContent,
} from '@mui/material';
import ArrowBackIcon      from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon  from '@mui/icons-material/CalendarMonth';
import TimerIcon          from '@mui/icons-material/Timer';
import TerrainIcon        from '@mui/icons-material/Terrain';
import ArticleIcon        from '@mui/icons-material/Article';
import HouseIcon          from '@mui/icons-material/House';
import CheckCircleIcon    from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon    from '@mui/icons-material/AutoAwesome';
import Navbar             from '../../../Components/User/Navbar';
import Footer             from '../../../Components/User/Footer';

// ── Dummy fallback ────────────────────────────────────────────────────────────
const DUMMY = {
    id: 1,
    trekking_route_name: 'Everest Base Camp Trek',
    difficulty: 'hard',
    duration_days: 14,
    max_altitude: 5364,
    best_season: 'Mar–May, Sep–Nov',
    permit_required: true,
    trekking_description: 'The Everest Base Camp Trek is one of the most iconic trekking routes in the world, leading you through the heart of the Khumbu region to the foot of the world\'s highest mountain at 5,364m. Walking in the footsteps of legendary mountaineers, you\'ll pass through Sherpa villages, ancient monasteries, dramatic glaciers, and breathtaking high-altitude landscapes. The journey is as much cultural as it is physical — a true once-in-a-lifetime adventure.',
    trekking_images: 'https://images.unsplash.com/photo-1574092526948-a41f4db8f2bf?w=1200&q=85',
    regions: { id: 1, region_name: 'Everest Region' },
    permits: [
        { id: 1, permit_name: 'Sagarmatha National Park Entry', price_in_usd: 30,  price_in_npr: 4000 },
        { id: 2, permit_name: 'TIMS Card',                      price_in_usd: 20,  price_in_npr: 2000 },
        { id: 3, permit_name: 'Khumbu Pasang Lhamu Rural Municipality', price_in_usd: 20, price_in_npr: 2000 },
    ],
    route_days: [
        { id: 1, day_number: 1, start_point: 'Lukla',        end_point: 'Phakding',     Distance_in_km: 8,  altitude: 2651, days_description: 'Fly to Lukla (2,840m) then trek down to Phakding through pine forests and the Dudh Koshi valley.', tea_house: [{ id: 1, house_name: 'Phakding Guest House', has_wifi: true, has_electricity: true, cost_per_night: 6 }] },
        { id: 2, day_number: 2, start_point: 'Phakding',     end_point: 'Namche Bazaar', Distance_in_km: 11, altitude: 3440, days_description: 'A longer day crossing several suspension bridges over the Dudh Koshi River, with a steep climb to Namche Bazaar — the gateway to Everest.', tea_house: [{ id: 2, house_name: 'Sherpa Lodge', has_wifi: true, has_electricity: true, cost_per_night: 8 }] },
        { id: 3, day_number: 3, start_point: 'Namche Bazaar',end_point: 'Namche Bazaar', Distance_in_km: 4,  altitude: 3440, days_description: 'Acclimatisation day in Namche. Hike up to the Everest View Hotel for your first views of Everest, Lhotse, and Ama Dablam. Return to Namche for rest.', tea_house: [{ id: 3, house_name: 'Everest View Hotel', has_wifi: true, has_electricity: true, cost_per_night: 15 }] },
        { id: 4, day_number: 4, start_point: 'Namche Bazaar',end_point: 'Tengboche',    Distance_in_km: 10, altitude: 3867, days_description: 'Trek through rhododendron forests to Tengboche, site of the famous Tengboche Monastery with stunning Everest views.', tea_house: [{ id: 4, house_name: 'Tengboche Lodge', has_wifi: false, has_electricity: true, cost_per_night: 7 }] },
        { id: 5, day_number: 5, start_point: 'Tengboche',    end_point: 'Dingboche',    Distance_in_km: 9,  altitude: 4410, days_description: 'Continue up the Khumbu valley, passing through Pangboche to reach Dingboche in the wide Imja Valley.', tea_house: [{ id: 5, house_name: 'Yak & Yeti Lodge', has_wifi: false, has_electricity: true, cost_per_night: 8 }] },
    ],
};

const DIFFICULTY_MAP = {
    easy:     { label: 'Easy',      bg: '#e8f5e9', color: '#2e7d32' },
    moderate: { label: 'Moderate',  bg: '#fff8e1', color: '#e65100' },
    hard:     { label: 'Hard',      bg: '#fce4ec', color: '#c62828' },
    hellmode: { label: 'Hell Mode', bg: '#1a0000', color: '#ff1744' },
};

export default function TrekkingRouteShow({ trekkingRoute }) {
    const { auth } = usePage().props;
    const data = trekkingRoute ?? DUMMY;
    const cfg  = DIFFICULTY_MAP[data.difficulty] ?? { label: data.difficulty, bg: '#f5f5f5', color: '#555' };

    return (
        <>
            <Head title={`${data.trekking_route_name} — TrekSathi`} />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Navbar user={auth?.user} />

                <Box sx={{ pt: '64px' }}>
                    {/* Hero */}
                    <Box sx={{ position: 'relative', height: { xs: 240, sm: 340, md: 420 }, bgcolor: 'grey.300', overflow: 'hidden' }}>
                        {data.trekking_images && (
                            <Box component="img" src={data.trekking_images} alt={data.trekking_route_name}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <Box sx={{ position: 'absolute', inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: { xs: 3, md: 5 } }}>
                            <Button onClick={() => router.back()} startIcon={<ArrowBackIcon />} size="small"
                                sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, px: 0, '&:hover': { color: 'white' } }}>
                                Back
                            </Button>
                            {/* Breadcrumb */}
                            {data.regions && (
                                <Typography variant="caption"
                                    onClick={() => router.visit(`/regions/${data.regions.id}`)}
                                    sx={{ color: 'secondary.main', cursor: 'pointer', display: 'block', mb: 0.5,
                                        '&:hover': { textDecoration: 'underline' } }}>
                                    {data.regions.region_name}
                                </Typography>
                            )}
                            <Typography variant="h3" fontWeight={800}
                                sx={{ color: 'white', fontFamily: 'Georgia, serif', lineHeight: 1.1 }}>
                                {data.trekking_route_name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                                <Chip label={cfg.label} size="small"
                                    sx={{ fontSize: '0.7rem', height: 22, fontWeight: 700, bgcolor: cfg.bg, color: cfg.color }} />
                                {data.permit_required && (
                                    <Chip label="Permit Required" size="small"
                                        sx={{ fontSize: '0.7rem', height: 22, fontWeight: 600,
                                            bgcolor: 'rgba(255,152,0,0.15)', color: '#ff9800',
                                            border: '1px solid rgba(255,152,0,0.3)' }} />
                                )}
                            </Box>
                        </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 5 }, py: 5 }}>
                        <Grid container spacing={4}>

                            {/* Left — description + day itinerary */}
                            <Grid item xs={12} md={7}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>About this Trek</Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.85, mb: 4 }}>
                                    {data.trekking_description ?? 'No description available.'}
                                </Typography>

                                {/* Day-by-day itinerary */}
                                {data.route_days?.length > 0 && (
                                    <>
                                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                            Day-by-Day Itinerary
                                        </Typography>
                                        <Stepper orientation="vertical" nonLinear>
                                            {data.route_days.map((day) => (
                                                <Step key={day.id} active>
                                                    <StepLabel
                                                        StepIconComponent={() => (
                                                            <Box sx={{ width: 28, height: 28, borderRadius: '50%',
                                                                bgcolor: 'primary.main', color: 'white',
                                                                display: 'flex', alignItems: 'center',
                                                                justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700 }}>
                                                                {day.day_number}
                                                            </Box>
                                                        )}>
                                                        <Typography variant="body2" fontWeight={700}>
                                                            {day.start_point} → {day.end_point}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {day.Distance_in_km}km · {Number(day.altitude).toLocaleString()}m
                                                        </Typography>
                                                    </StepLabel>
                                                    <StepContent>
                                                        <Typography variant="body2" color="text.secondary"
                                                            sx={{ lineHeight: 1.7, mb: 1 }}>
                                                            {day.days_description}
                                                        </Typography>
                                                        {/* Tea houses on this day */}
                                                        {day.tea_house?.length > 0 && (
                                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1, mb: 1 }}>
                                                                {day.tea_house.map(h => (
                                                                    <Chip
                                                                        key={h.id}
                                                                        icon={<HouseIcon sx={{ fontSize: '14px !important' }} />}
                                                                        label={`${h.house_name} · $${h.cost_per_night}/night`}
                                                                        size="small"
                                                                        onClick={() => router.visit(`/teahouses/${h.id}`)}
                                                                        sx={{ fontSize: '0.68rem', height: 22,
                                                                            bgcolor: '#f5f5f5', cursor: 'pointer',
                                                                            '&:hover': { bgcolor: '#e8f5e9' } }}
                                                                    />
                                                                ))}
                                                            </Box>
                                                        )}
                                                    </StepContent>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </>
                                )}
                            </Grid>

                            {/* Right — quick facts + permits + CTA */}
                            <Grid item xs={12} md={5}>
                                {/* Quick facts */}
                                <Paper variant="outlined" sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>Trek Summary</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {[
                                            { icon: <TimerIcon sx={{ fontSize: 18, color: 'primary.main' }} />,     label: 'Duration',     val: `${data.duration_days} days` },
                                            { icon: <TerrainIcon sx={{ fontSize: 18, color: 'primary.main' }} />,   label: 'Max Altitude', val: `${Number(data.max_altitude).toLocaleString()}m` },
                                            { icon: <CalendarMonthIcon sx={{ fontSize: 18, color: 'primary.main' }} />, label: 'Best Season', val: data.best_season ?? '—' },
                                        ].map(item => (
                                            <Box key={item.label} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                                {item.icon}
                                                <Box>
                                                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>{item.label}</Typography>
                                                    <Typography variant="body2" fontWeight={600}>{item.val}</Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>

                                {/* Permits */}
                                {data.permits?.length > 0 && (
                                    <Paper variant="outlined" sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                            <ArticleIcon sx={{ fontSize: 17, color: 'primary.main' }} />
                                            <Typography variant="subtitle2" fontWeight={700}>Permits Required</Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        {data.permits.map(p => (
                                            <Box key={p.id} sx={{ display: 'flex', justifyContent: 'space-between',
                                                alignItems: 'center', py: 1,
                                                borderBottom: '1px solid', borderColor: 'divider',
                                                '&:last-child': { borderBottom: 'none', pb: 0 } }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CheckCircleIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                                                    <Typography variant="caption">{p.permit_name}</Typography>
                                                </Box>
                                                <Typography variant="caption" fontWeight={700} color="primary.main">
                                                    ${p.price_in_usd}
                                                </Typography>
                                            </Box>
                                        ))}
                                        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider',
                                            display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption" fontWeight={700}>Total</Typography>
                                            <Typography variant="caption" fontWeight={700} color="primary.main">
                                                ${data.permits.reduce((sum, p) => sum + (p.price_in_usd ?? 0), 0)}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                )}

                                {/* CTAs */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Button variant="contained" fullWidth startIcon={<AutoAwesomeIcon />}
                                        onClick={() => router.visit('/chat')}
                                        sx={{ py: 1.25 }}>
                                        Plan this Trek with AI
                                    </Button>
                                    <Button variant="outlined" fullWidth
                                        onClick={() => router.visit(`/regions/${data.regions?.id}`)}
                                        sx={{ py: 1.25 }}>
                                        Explore {data.regions?.region_name ?? 'Region'}
                                    </Button>
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
