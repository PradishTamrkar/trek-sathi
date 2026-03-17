import React, { useState, useRef } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import {
    Box, Typography, Paper, Chip, Button, Divider,
    IconButton, Grid, TextField, CircularProgress,
    InputAdornment, useTheme, useMediaQuery,
} from '@mui/material';
import ChevronLeftIcon       from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon      from '@mui/icons-material/ChevronRight';
import AutoAwesomeIcon       from '@mui/icons-material/AutoAwesome';
import TerrainIcon           from '@mui/icons-material/Terrain';
import GroupsIcon            from '@mui/icons-material/Groups';
import MapIcon               from '@mui/icons-material/Map';
import SupportAgentIcon      from '@mui/icons-material/SupportAgent';
import PersonOutlineIcon     from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon     from '@mui/icons-material/EmailOutlined';
import TopicOutlinedIcon     from '@mui/icons-material/TopicOutlined';
import MessageOutlinedIcon   from '@mui/icons-material/MessageOutlined';
import SendIcon              from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon      from '@mui/icons-material/ArrowForward';
import Navbar                from '../../Components/User/Navbar';
import Footer                from '../../Components/User/Footer';
import UserSidebar, { SIDEBAR_W } from '../../Components/User/UserSidebar';

//Section nav links
const SECTION_LINKS = [
    { label: 'Explore',    href: '#explore'    },
    { label: 'Routes',     href: '#routes'     },
    { label: 'Tea Houses', href: '#tea-houses' },
    { label: 'About',      href: '#about'      },
    { label: 'Contact',    href: '#contact'    },
];

// ── Dummy data ────────────────────────────────────────────────────────────────
const DUMMY_REGIONS = [
    { id: 1, region_name: 'Everest Region',   best_season: 'Mar–May, Sep–Nov', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', region_description: 'Home to the world\'s highest peak and iconic Sherpa culture.' },
    { id: 2, region_name: 'Annapurna Region', best_season: 'Oct–Nov, Mar–Apr', image: 'https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=600&q=80', region_description: 'Diverse landscapes from subtropical forests to high alpine terrain.' },
    { id: 3, region_name: 'Langtang Region',  best_season: 'Mar–May, Oct–Dec', image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600&q=80', region_description: 'The valley of glaciers — close to Kathmandu yet wild and remote.' },
    { id: 4, region_name: 'Manaslu Region',   best_season: 'Sep–Nov',          image: 'https://images.unsplash.com/photo-1580639129040-444d7f245427?w=600&q=80', region_description: 'A restricted circuit trek around the world\'s eighth highest peak.' },
    { id: 5, region_name: 'Mustang Region',   best_season: 'May–Oct',          image: 'https://images.unsplash.com/photo-1516132006923-6cf348e5dee2?w=600&q=80', region_description: 'Ancient Tibetan kingdom with dramatic desert landscapes.' },
    { id: 6, region_name: 'Kanchenjunga',     best_season: 'Apr–May, Oct–Nov', image: 'https://images.unsplash.com/photo-1550093573-23ae25d44abe?w=600&q=80', region_description: 'Remote wilderness near the third highest mountain on Earth.' },
];

const DIFFICULTY_MAP = {
    easy:     { label: 'Easy',      bg: '#e8f5e9', color: '#2e7d32' },
    moderate: { label: 'Moderate',  bg: '#fff8e1', color: '#e65100' },
    hard:     { label: 'Hard',      bg: '#fce4ec', color: '#c62828' },
    hellmode: { label: 'Hell Mode', bg: '#1a0000', color: '#ff1744' },
};

const DUMMY_ROUTES = [
    { id: 1, trekking_route_name: 'Everest Base Camp',    difficulty: 'hard',     duration_days: 14, max_altitude: 5364, region_name: 'Everest',   permit_required: true,  image: 'https://images.unsplash.com/photo-1574092526948-a41f4db8f2bf?w=600&q=80' },
    { id: 2, trekking_route_name: 'Annapurna Circuit',    difficulty: 'moderate', duration_days: 21, max_altitude: 5416, region_name: 'Annapurna', permit_required: true,  image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
    { id: 3, trekking_route_name: 'Langtang Valley Trek', difficulty: 'moderate', duration_days: 7,  max_altitude: 3800, region_name: 'Langtang',  permit_required: false, image: 'https://images.unsplash.com/photo-1543051932-6ef9fecfbe70?w=600&q=80' },
    { id: 4, trekking_route_name: 'Gokyo Lakes Trek',     difficulty: 'hard',     duration_days: 12, max_altitude: 5357, region_name: 'Everest',   permit_required: true,  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
    { id: 5, trekking_route_name: 'Poon Hill Trek',       difficulty: 'easy',     duration_days: 4,  max_altitude: 3210, region_name: 'Annapurna', permit_required: false, image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80' },
    { id: 6, trekking_route_name: 'Manaslu Circuit',      difficulty: 'hard',     duration_days: 16, max_altitude: 5106, region_name: 'Manaslu',   permit_required: true,  image: 'https://images.unsplash.com/photo-1580639129040-444d7f245427?w=600&q=80' },
];

const DUMMY_TEAHOUSES = [
    { id: 1, house_name: 'Everest View Hotel',    location: 'Namche Bazaar',    altitude: 3880, cost: 15, wifi: true,  electricity: true,  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
    { id: 2, house_name: 'Yak & Yeti Lodge',      location: 'Dingboche',        altitude: 4360, cost: 8,  wifi: false, electricity: true,  image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80' },
    { id: 3, house_name: 'Annapurna Eco Lodge',   location: 'Chomrong',         altitude: 2170, cost: 10, wifi: true,  electricity: true,  image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
    { id: 4, house_name: 'High Camp Lodge',       location: 'Thorong La',       altitude: 4925, cost: 6,  wifi: false, electricity: false, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80' },
    { id: 5, house_name: 'Langtang Guest House',  location: 'Langtang Village', altitude: 3430, cost: 7,  wifi: false, electricity: true,  image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80' },
    { id: 6, house_name: 'Himalayan Sunrise Inn', location: 'Gokyo',            altitude: 4790, cost: 9,  wifi: true,  electricity: true,  image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80' },
];

// ── Hero section ──────────────────────────────────────────────────────────────
function HeroSection({ user }) {
    const firstName = user?.name?.split(' ')[0] ?? 'Trekker';

    return (
        <Box sx={{
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            mb: 6,
            minHeight: { xs: 280, sm: 320, md: 360 },
            display: 'flex',
            alignItems: 'flex-end',
            background: 'linear-gradient(135deg, #0a1a0e 0%, #1a3a2f 50%, #2d5a3d 100%)',
        }}>
            {/* Stars */}
            <Box sx={{
                position: 'absolute', inset: 0,
                backgroundImage: `
                    radial-gradient(1px 1px at 8%  18%, rgba(255,255,255,.9) 0%, transparent 100%),
                    radial-gradient(1.5px 1.5px at 25% 9%,  rgba(255,255,255,1)  0%, transparent 100%),
                    radial-gradient(1px 1px at 55% 13%, rgba(255,255,255,.7) 0%, transparent 100%),
                    radial-gradient(1px 1px at 78% 22%, rgba(255,255,255,.6) 0%, transparent 100%),
                    radial-gradient(1px 1px at 42% 35%, rgba(255,255,255,.4) 0%, transparent 100%),
                    radial-gradient(1.5px 1.5px at 88% 12%, rgba(255,255,255,.8) 0%, transparent 100%),
                    radial-gradient(1px 1px at 15% 48%, rgba(255,255,255,.3) 0%, transparent 100%)
                `,
            }} />

            {/* Mountain SVG — right side decoration */}
            <Box component="svg" viewBox="0 0 600 300" fill="none"
                sx={{
                    position: 'absolute', right: 0, bottom: 0,
                    height: '100%', width: 'auto',
                    opacity: { xs: 0.18, md: 0.28 },
                    pointerEvents: 'none',
                }}>
                <path d="M0 300L0 210L80 168L150 198L240 120L330 162L420 58L510 108L560 80L600 95L600 300Z"
                    fill="#4caf50" opacity=".4" />
                <path d="M0 300L0 240L100 185L200 220L300 145L390 180L480 95L570 135L600 118L600 300Z"
                    fill="#2e7d32" opacity=".55" />
                <path d="M250 300L420 55L590 300Z" fill="#1b5e20" opacity=".5" />
                <path d="M320 300L420 35L520 300Z" fill="#2e7d32" opacity=".6" />
                {/* Snow caps */}
                <path d="M420 35L436 64L450 56L464 74L446 82L428 70L412 81L394 73L408 55L420 64Z"
                    fill="white" opacity=".7" />
                <path d="M480 95L491 114L499 109L508 121L497 127L486 119L475 126L464 121L473 109L481 114Z"
                    fill="white" opacity=".5" />
            </Box>

            {/* Gradient overlay — ensures text is readable */}
            <Box sx={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, rgba(10,26,14,0.92) 0%, rgba(10,26,14,0.7) 55%, rgba(10,26,14,0.1) 100%)',
            }} />

            {/* Content */}
            <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 3, sm: 4, md: 5 }, maxWidth: 560 }}>
                {/* Greeting badge */}
                <Box sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 0.75,
                    bgcolor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '100px', px: 1.75, py: 0.5, mb: 2.5,
                }}>
                    <Box sx={{
                        width: 6, height: 6, borderRadius: '50%', bgcolor: 'secondary.main',
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%,100%': { opacity: 1, transform: 'scale(1)' },
                            '50%':     { opacity: 0.5, transform: 'scale(0.85)' },
                        },
                    }} />
                    <Typography variant="caption"
                        sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em' }}>
                        Welcome back, {firstName}
                    </Typography>
                </Box>

                <Typography variant="h3" fontWeight={800}
                    sx={{
                        color: 'white', fontFamily: 'Georgia, serif',
                        lineHeight: 1.12, mb: 1.5,
                        fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.6rem' },
                    }}>
                    Where will your<br />
                    <Box component="span" sx={{ color: 'secondary.main' }}>
                        next trek take you?
                    </Box>
                </Typography>

                <Typography variant="body1"
                    sx={{ color: 'rgba(255,255,255,0.5)', mb: 3.5, lineHeight: 1.8, maxWidth: 380 }}>
                    Explore Nepal's greatest trails, plan with AI, or browse
                    routes and tea houses below.
                </Typography>

                {/* CTAs */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AutoAwesomeIcon />}
                        onClick={() => router.visit('/chat')}
                        sx={{ px: 3, py: 1.25, fontSize: '0.9rem' }}
                    >
                        Plan with AI
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => {
                            document.querySelector('#explore')
                                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        sx={{
                            px: 3, py: 1.25, fontSize: '0.9rem',
                            color: 'rgba(255,255,255,0.7)',
                            borderColor: 'rgba(255,255,255,0.25)',
                            '&:hover': {
                                borderColor: 'rgba(255,255,255,0.6)',
                                bgcolor: 'rgba(255,255,255,0.06)',
                                color: 'white',
                            },
                        }}
                    >
                        Explore Routes
                    </Button>
                </Box>

                {/* Quick stats row */}
                <Box sx={{ display: 'flex', gap: 3, mt: 4, flexWrap: 'wrap' }}>
                    {[['50+', 'Routes'], ['15+', 'Regions'], ['500+', 'Tea Houses']].map(([val, label]) => (
                        <Box key={label}>
                            <Typography variant="h6" fontWeight={800}
                                sx={{ color: 'secondary.main', lineHeight: 1 }}>
                                {val}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>
                                {label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

// ── Scroll section wrapper ────────────────────────────────────────────────────
function ScrollSection({ id, title, subtitle, emoji, children, itemCount }) {
    const scrollRef = useRef(null);
    const theme     = useTheme();
    const isMd      = useMediaQuery(theme.breakpoints.up('md'));
    const isSm      = useMediaQuery(theme.breakpoints.up('sm'));
    const visible   = isMd ? 4 : isSm ? 2 : 1;

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        const cardW = scrollRef.current.scrollWidth / itemCount;
        scrollRef.current.scrollBy({ left: dir * cardW * visible, behavior: 'smooth' });
    };

    return (
        <Box id={id} sx={{ mb: 7, scrollMarginTop: '80px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ fontSize: 22, lineHeight: 1 }}>{emoji}</Typography>
                    <Box>
                        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>{title}</Typography>
                        {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
                    </Box>
                </Box>
                {itemCount > visible && (
                    <Box sx={{ display: 'flex', gap: 0.75 }}>
                        <IconButton size="small" onClick={() => scroll(-1)}
                            sx={{ border: '1px solid', borderColor: 'divider', width: 32, height: 32,
                                '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
                            <ChevronLeftIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => scroll(1)}
                            sx={{ border: '1px solid', borderColor: 'divider', width: 32, height: 32,
                                '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
                            <ChevronRightIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </Box>
            <Box ref={scrollRef} sx={{
                display: 'flex', gap: 2,
                overflowX: 'auto', scrollSnapType: 'x mandatory', pb: 1,
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none', scrollbarWidth: 'none',
            }}>
                {children}
            </Box>
        </Box>
    );
}

function ScrollCard({ children }) {
    return (
        <Box sx={{
            scrollSnapAlign: 'start', flexShrink: 0,
            width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
        }}>
            {children}
        </Box>
    );
}

// ── Cards ─────────────────────────────────────────────────────────────────────
function RegionCard({ region }) {
    return (
        <Paper variant="outlined" onClick={() => router.visit(`/regions/${region.id}`)}
            sx={{ borderRadius: 3, overflow: 'hidden', cursor: 'pointer', height: '100%',
                transition: 'all 0.18s',
                '&:hover': { borderColor: 'primary.main', transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(46,125,50,0.13)' } }}>
            <Box sx={{ height: 160, overflow: 'hidden', position: 'relative', bgcolor: 'grey.200' }}>
                <Box component="img" src={region.image} alt={region.region_name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.35s', '.MuiPaper-root:hover &': { transform: 'scale(1.06)' } }} />
                {region.best_season && (
                    <Chip label={region.best_season} size="small"
                        sx={{ position: 'absolute', bottom: 8, left: 8, fontSize: '0.62rem', height: 20,
                            fontWeight: 600, bgcolor: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(4px)' }} />
                )}
            </Box>
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" fontWeight={700} gutterBottom>{region.region_name}</Typography>
                <Typography variant="caption" color="text.secondary"
                    sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {region.region_description}
                </Typography>
            </Box>
        </Paper>
    );
}

function RouteCard({ route }) {
    const cfg = DIFFICULTY_MAP[route.difficulty] ?? { label: route.difficulty, bg: '#f5f5f5', color: '#555' };
    return (
        <Paper variant="outlined" onClick={() => router.visit(`/routes/${route.id}`)}
            sx={{ borderRadius: 3, overflow: 'hidden', cursor: 'pointer', height: '100%',
                transition: 'all 0.18s',
                '&:hover': { borderColor: 'primary.main', transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(46,125,50,0.13)' } }}>
            <Box sx={{ height: 160, overflow: 'hidden', position: 'relative', bgcolor: 'grey.200' }}>
                <Box component="img" src={route.image} alt={route.trekking_route_name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.35s', '.MuiPaper-root:hover &': { transform: 'scale(1.06)' } }} />
                <Chip label={cfg.label} size="small"
                    sx={{ position: 'absolute', top: 8, right: 8, fontSize: '0.62rem', height: 20,
                        fontWeight: 700, bgcolor: cfg.bg, color: cfg.color }} />
            </Box>
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" fontWeight={700} noWrap gutterBottom>{route.trekking_route_name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    {route.region_name}
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

function TeaHouseCard({ house }) {
    return (
        <Paper variant="outlined" onClick={() => router.visit(`/teahouses/${house.id}`)}
            sx={{ borderRadius: 3, overflow: 'hidden', cursor: 'pointer', height: '100%',
                transition: 'all 0.18s',
                '&:hover': { borderColor: 'primary.main', transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(46,125,50,0.13)' } }}>
            <Box sx={{ height: 160, overflow: 'hidden', bgcolor: 'grey.200' }}>
                <Box component="img" src={house.image} alt={house.house_name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.35s', '.MuiPaper-root:hover &': { transform: 'scale(1.06)' } }} />
            </Box>
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" fontWeight={700} gutterBottom>{house.house_name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    {house.location} · {Number(house.altitude).toLocaleString()}m
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1 }}>
                    {house.wifi && <Chip label="WiFi" size="small"
                        sx={{ fontSize: '0.6rem', height: 16, bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600 }} />}
                    {house.electricity && <Chip label="Electric" size="small"
                        sx={{ fontSize: '0.6rem', height: 16, bgcolor: '#fff8e1', color: '#e65100', fontWeight: 600 }} />}
                </Box>
                <Typography variant="caption" fontWeight={700} color="primary.main">
                    ${house.cost} / night
                </Typography>
            </Box>
        </Paper>
    );
}

// ── About section ─────────────────────────────────────────────────────────────
function AboutSection() {
    const features = [
        { icon: <AutoAwesomeIcon />, title: 'AI Trip Planner',    desc: 'Chat with our AI to build a personalised day-by-day itinerary in minutes.',      color: '#2e7d32', bg: '#e8f5e9' },
        { icon: <MapIcon />,         title: '50+ Trekking Routes', desc: 'Comprehensive coverage of Nepal\'s greatest trails with up-to-date info.',       color: '#1565c0', bg: '#e3f2fd' },
        { icon: <GroupsIcon />,      title: 'Community Reports',   desc: 'Real trail conditions from trekkers who just came back — not outdated guides.',   color: '#e65100', bg: '#fff8e1' },
        { icon: <SupportAgentIcon />,title: '24/7 Support',        desc: 'Got a question at 2am before your flight? Our AI and team are always on.',       color: '#6a1b9a', bg: '#f3e5f5' },
    ];

    return (
        <Box id="about" sx={{
            scrollMarginTop: '80px', mb: 7,
            borderRadius: 4, overflow: 'hidden',
            background: 'linear-gradient(135deg, #0d1f14 0%, #1a3a2f 100%)',
            p: { xs: 3, md: 5 },
        }}>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'flex-start', gap: 2,
                flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between' }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <TerrainIcon sx={{ color: 'secondary.main', fontSize: 16 }} />
                        <Typography variant="caption"
                            sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            About TrekSathi
                        </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={800}
                        sx={{ color: 'white', fontFamily: 'Georgia, serif', lineHeight: 1.15, mb: 1.5 }}>
                        Nepal Trekking,<br />
                        <Box component="span" sx={{ color: 'secondary.main' }}>Made Effortless</Box>
                    </Typography>
                    <Typography variant="body1"
                        sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 420, lineHeight: 1.8 }}>
                        TrekSathi was built by Nepal trekkers for Nepal trekkers.
                        We combine AI technology with deep local knowledge so you spend
                        less time planning and more time on the trail.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: { xs: 3, md: 4 }, flexWrap: 'wrap', alignSelf: { md: 'center' } }}>
                    {[['50+', 'Routes'], ['15+', 'Regions'], ['500+', 'Tea Houses'], ['24/7', 'AI']].map(([val, label]) => (
                        <Box key={label} sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight={800} sx={{ color: 'secondary.main', lineHeight: 1 }}>{val}</Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{label}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Grid container spacing={2}>
                {features.map(f => (
                    <Grid item xs={12} sm={6} md={3} key={f.title}>
                        <Box sx={{
                            p: 2.5, borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            height: '100%', transition: 'all 0.2s',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' },
                        }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: f.bg, color: f.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                {f.icon}
                            </Box>
                            <Typography variant="body2" fontWeight={700} color="white" gutterBottom>{f.title}</Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                                {f.desc}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

// ── Contact section ───────────────────────────────────────────────────────────
const QUICK_TOPICS = ['Trek Planning', 'Permit Info', 'Tea House Booking', 'AI Planner Help', 'General Inquiry'];

function ContactSection() {
    const { data, setData, post, processing, errors, reset } = useForm({
        contact_name: '', contact_email: '', topic: '', message: '',
    });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => { reset(); setSent(true); },
        });
    };

    return (
        <Box id="contact" sx={{ scrollMarginTop: '80px', mb: 7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Typography sx={{ fontSize: 22, lineHeight: 1 }}>✉️</Typography>
                <Box>
                    <Typography variant="h6" fontWeight={700}>Get in Touch</Typography>
                    <Typography variant="caption" color="text.secondary">
                        Questions about a route, permit, or anything else? We reply fast.
                    </Typography>
                </Box>
            </Box>
            <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: '#f9fff9', borderColor: '#c8e6c9' }}>
                        <Typography variant="subtitle2" fontWeight={700} color="primary.dark" gutterBottom>
                            🏔️ Quick Answers
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
                            Our AI can instantly answer most trekking questions — permits, altitudes,
                            best seasons, tea houses, and itineraries.
                        </Typography>
                        <Button variant="contained" fullWidth size="small"
                            startIcon={<AutoAwesomeIcon />}
                            onClick={() => router.visit('/chat')}>
                            Ask the AI Instead
                        </Button>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.8 }}>
                            📧 hello@treksathi.com<br />
                            🕒 We reply within 24 hours<br />
                            📍 Based in Kathmandu, Nepal
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
                        {sent ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#e8f5e9',
                                    mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircleOutlineIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                                </Box>
                                <Typography variant="h6" fontWeight={700} gutterBottom>Message Sent!</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    We'll get back to you within 24 hours.
                                </Typography>
                                <Button variant="outlined" size="small" onClick={() => setSent(false)}>
                                    Send Another
                                </Button>
                            </Box>
                        ) : (
                            <Box component="form" onSubmit={handleSubmit}
                                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                    <TextField label="Your Name" value={data.contact_name}
                                        onChange={e => setData('contact_name', e.target.value)}
                                        error={!!errors.contact_name} helperText={errors.contact_name}
                                        required placeholder="e.g. Ram Sharma"
                                        InputProps={{ startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlineIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                                            </InputAdornment>
                                        )}} />
                                    <TextField label="Email" type="email" value={data.contact_email}
                                        onChange={e => setData('contact_email', e.target.value)}
                                        error={!!errors.contact_email} helperText={errors.contact_email}
                                        required placeholder="you@example.com"
                                        InputProps={{ startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                                            </InputAdornment>
                                        )}} />
                                </Box>
                                <Box>
                                    <TextField label="Topic" value={data.topic}
                                        onChange={e => setData('topic', e.target.value)}
                                        error={!!errors.topic} helperText={errors.topic}
                                        required placeholder="What's this about?"
                                        InputProps={{ startAdornment: (
                                            <InputAdornment position="start">
                                                <TopicOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                                            </InputAdornment>
                                        )}} />
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                                        {QUICK_TOPICS.map(t => (
                                            <Chip key={t} label={t} size="small"
                                                onClick={() => setData('topic', t)}
                                                variant={data.topic === t ? 'filled' : 'outlined'}
                                                sx={{ fontSize: '0.7rem', cursor: 'pointer', transition: 'all 0.15s',
                                                    ...(data.topic === t
                                                        ? { bgcolor: 'primary.main', color: 'white' }
                                                        : { '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }
                                                    )}} />
                                        ))}
                                    </Box>
                                </Box>
                                <TextField label="Message" value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    error={!!errors.message}
                                    helperText={errors.message || `${data.message.length}/2000`}
                                    required multiline rows={4}
                                    placeholder="Tell us what you need…"
                                    inputProps={{ maxLength: 2000 }}
                                    InputProps={{ startAdornment: (
                                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                            <MessageOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                                        </InputAdornment>
                                    )}} />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="submit" variant="contained" size="large"
                                        disabled={processing}
                                        endIcon={processing ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                                        sx={{ px: 4 }}>
                                        {processing ? 'Sending…' : 'Send Message'}
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
    const { auth }  = usePage().props;
    const user      = auth?.user;
    const theme     = useTheme();
    const isMobile  = useMediaQuery(theme.breakpoints.down('sm'));
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const chatSessions = [];
    const savedTrips   = [];

    return (
        <>
            <Head title="Home — TrekSathi" />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Navbar user={user} sectionLinks={SECTION_LINKS} />

                <Box sx={{ display: 'flex', flex: 1, pt: '64px' }}>
                    <UserSidebar
                        open={!isMobile && sidebarOpen}
                        chatSessions={chatSessions}
                        savedTrips={savedTrips}
                        activePage="home"
                    />

                    {/* Sidebar toggle */}
                    <Box sx={{
                        position: 'fixed', top: '50%', zIndex: 11,
                        left: (!isMobile && sidebarOpen) ? SIDEBAR_W : 0,
                        transform: 'translateY(-50%)', transition: 'left 0.25s ease',
                        display: { xs: 'none', sm: 'block' },
                    }}>
                        <IconButton onClick={() => setSidebarOpen(o => !o)} size="small" sx={{
                            bgcolor: '#1a2e1f', color: 'rgba(255,255,255,0.5)',
                            border: '1px solid rgba(255,255,255,0.08)', borderLeft: 'none',
                            borderRadius: '0 6px 6px 0', width: 20, height: 40,
                            '&:hover': { bgcolor: '#243d29', color: 'white' },
                        }}>
                            {sidebarOpen ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                        </IconButton>
                    </Box>

                    {/* Main content */}
                    <Box sx={{
                        flex: 1, minWidth: 0,
                        ml: (!isMobile && sidebarOpen) ? `${SIDEBAR_W}px` : 0,
                        transition: 'margin-left 0.25s ease',
                        p: { xs: 2, sm: 3, md: 4 },
                    }}>
                        {/* ── Hero ── */}
                        <HeroSection user={user} />

                        {/* ── Regions ── */}
                        <ScrollSection id="explore" title="Explore Regions" emoji="🗺️"
                            subtitle="Click a region to see all routes and details"
                            itemCount={DUMMY_REGIONS.length}>
                            {DUMMY_REGIONS.map(r => <ScrollCard key={r.id}><RegionCard region={r} /></ScrollCard>)}
                        </ScrollSection>

                        <Divider sx={{ mb: 7 }} />

                        {/* ── Routes ── */}
                        <ScrollSection id="routes" title="Popular Trekking Routes" emoji="🏔️"
                            subtitle="Top routes across Nepal — click for full details"
                            itemCount={DUMMY_ROUTES.length}>
                            {DUMMY_ROUTES.map(r => <ScrollCard key={r.id}><RouteCard route={r} /></ScrollCard>)}
                        </ScrollSection>

                        <Divider sx={{ mb: 7 }} />

                        {/* ── Tea Houses ── */}
                        <ScrollSection id="tea-houses" title="Tea Houses" emoji="🏠"
                            subtitle="Accommodation along the trails"
                            itemCount={DUMMY_TEAHOUSES.length}>
                            {DUMMY_TEAHOUSES.map(h => <ScrollCard key={h.id}><TeaHouseCard house={h} /></ScrollCard>)}
                        </ScrollSection>

                        <Divider sx={{ mb: 7 }} />

                        {/* ── About ── */}
                        <AboutSection />

                        <Divider sx={{ mb: 7 }} />

                        {/* ── Contact ── */}
                        <ContactSection />
                    </Box>
                </Box>

                <Box sx={{
                    ml: (!isMobile && sidebarOpen) ? `${SIDEBAR_W}px` : 0,
                    transition: 'margin-left 0.25s ease',
                }}>
                    <Footer />
                </Box>
            </Box>
        </>
    );
}
