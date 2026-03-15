import { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import {
    Box, Typography, Paper, Chip, Button, Divider,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem, Slider,
    FormControlLabel, Switch, CircularProgress, Alert,
    TextField, InputAdornment, useTheme, useMediaQuery,
} from '@mui/material';
import AddIcon          from '@mui/icons-material/Add';
import HistoryIcon      from '@mui/icons-material/History';
import BookmarkIcon     from '@mui/icons-material/Bookmark';
import ChevronLeftIcon  from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutoAwesomeIcon  from '@mui/icons-material/AutoAwesome';
import TuneIcon         from '@mui/icons-material/Tune';
import CloseIcon        from '@mui/icons-material/Close';
import SearchIcon       from '@mui/icons-material/Search';
import AltRouteIcon     from '@mui/icons-material/AltRoute';
import Navbar           from '../../Components/User/Navbar';
import Footer           from '../../Components/User/Footer';

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
    { id: 1, house_name: 'Everest View Hotel',   location: 'Namche Bazaar',   altitude: 3880, cost: 15, wifi: true,  electricity: true,  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
    { id: 2, house_name: 'Yak & Yeti Lodge',     location: 'Dingboche',       altitude: 4360, cost: 8,  wifi: false, electricity: true,  image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80' },
    { id: 3, house_name: 'Annapurna Eco Lodge',  location: 'Chomrong',        altitude: 2170, cost: 10, wifi: true,  electricity: true,  image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
    { id: 4, house_name: 'High Camp Lodge',      location: 'Thorong La',      altitude: 4925, cost: 6,  wifi: false, electricity: false, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80' },
    { id: 5, house_name: 'Langtang Guest House', location: 'Langtang Village', altitude: 3430, cost: 7,  wifi: false, electricity: true,  image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80' },
    { id: 6, house_name: 'Himalayan Sunrise Inn',location: 'Gokyo',           altitude: 4790, cost: 9,  wifi: true,  electricity: true,  image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80' },
];

const DUMMY_CHAT_SESSIONS = [
    { session_id: 'abc1', first_message: 'Plan EBC trek for October…', created_at: '2025-03-10' },
    { session_id: 'abc2', first_message: 'Best tea houses in Namche?',  created_at: '2025-03-08' },
    { session_id: 'abc3', first_message: 'Annapurna permit cost 2025',  created_at: '2025-03-05' },
];

const DUMMY_SAVED_TRIPS = [
    { id: 1, trip_title: 'EBC October 2025',      route_name: 'Everest Base Camp'  },
    { id: 2, trip_title: 'Annapurna Family Trip',  route_name: 'Annapurna Circuit'  },
];

const SIDEBAR_W = 260;

function PlanTripModal({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1, pr: 6 }}>
                <Typography variant="h6" fontWeight={700}>Plan a Trip</Typography>
                <Typography variant="caption" color="text.secondary">How would you like to start?</Typography>
                <IconButton onClick={onClose} size="small"
                    sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 2.5, pb: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    {/* Plan with AI */}
                    <Paper variant="outlined"
                        onClick={() => { onClose(); router.visit('/chat'); }}
                        sx={{ p: 2.5, borderRadius: 2.5, cursor: 'pointer', transition: 'all 0.18s',
                            '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(46,125,50,0.03)', transform: 'translateY(-1px)' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: '#e8f5e9', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <AutoAwesomeIcon sx={{ color: 'primary.main' }} />
                            </Box>
                            <Box>
                                <Typography variant="body1" fontWeight={700}>Plan with AI</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Chat with our AI — get a personalised itinerary in minutes
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Plan Yourself */}
                    <Paper variant="outlined"
                        onClick={() => {
                            onClose();
                            setTimeout(() => document.getElementById('find-your-route')
                                ?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
                        }}
                        sx={{ p: 2.5, borderRadius: 2.5, cursor: 'pointer', transition: 'all 0.18s',
                            '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(46,125,50,0.03)', transform: 'translateY(-1px)' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: '#e3f2fd', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TuneIcon sx={{ color: '#1565c0' }} />
                            </Box>
                            <Box>
                                <Typography variant="body1" fontWeight={700}>Plan Yourself</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Filter by region, difficulty, duration and more
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} color="inherit" fullWidth>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// HORIZONTAL SCROLL SECTION
// 4 cards desktop / 2 tablet / 1 mobile, arrow buttons to page through
// ─────────────────────────────────────────────────────────────────────────────
function ScrollSection({ title, subtitle, emoji, children, itemCount }) {
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
        <Box sx={{ mb: 6 }}>
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
                overflowX: 'auto', scrollSnapType: 'x mandatory',
                pb: 1,
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none', scrollbarWidth: 'none',
            }}>
                {children}
            </Box>
        </Box>
    );
}

// Card that snaps and sizes correctly per breakpoint
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

// ─────────────────────────────────────────────────────────────────────────────
// CARDS
// ─────────────────────────────────────────────────────────────────────────────
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
                <Typography variant="body2" fontWeight={700} noWrap gutterBottom>
                    {route.trekking_route_name}
                </Typography>
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
                    {house.wifi && (
                        <Chip label="WiFi" size="small"
                            sx={{ fontSize: '0.6rem', height: 16, bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600 }} />
                    )}
                    {house.electricity && (
                        <Chip label="Electric" size="small"
                            sx={{ fontSize: '0.6rem', height: 16, bgcolor: '#fff8e1', color: '#e65100', fontWeight: 600 }} />
                    )}
                </Box>
                <Typography variant="caption" fontWeight={700} color="primary.main">
                    ${house.cost} / night
                </Typography>
            </Box>
        </Paper>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar({ open, chatSessions, savedTrips, onPlanTrip }) {
    return (
        <Box sx={{
            width: open ? SIDEBAR_W : 0, flexShrink: 0, overflow: 'hidden',
            transition: 'width 0.25s ease', bgcolor: '#1a2e1f',
            position: 'fixed', top: 64, bottom: 0, left: 0, zIndex: 10,
        }}>
            <Box sx={{ width: SIDEBAR_W, height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

                {/* Plan a Trip */}
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={onPlanTrip}
                        sx={{ py: 1, justifyContent: 'flex-start', px: 2 }}>
                        Plan a Trip
                    </Button>
                </Box>

                <Box sx={{ p: 2, flex: 1 }}>
                    {/* Chat History */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <HistoryIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }} />
                        <Typography variant="caption" fontWeight={700}
                            sx={{ color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Chat History
                        </Typography>
                    </Box>
                    {chatSessions.length === 0
                        ? <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.22)', pl: 0.5, display: 'block', mb: 2 }}>
                            No chats yet
                          </Typography>
                        : chatSessions.map(s => (
                            <Box key={s.session_id} onClick={() => router.visit(`/chat/${s.session_id}`)}
                                sx={{ px: 1.5, py: 0.9, borderRadius: 1.5, mb: 0.5, cursor: 'pointer',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}>
                                <Typography variant="body2" noWrap sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }}>
                                    {s.first_message}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)' }}>
                                    {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Typography>
                            </Box>
                        ))
                    }

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 2 }} />

                    {/* Saved Trips */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <BookmarkIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }} />
                        <Typography variant="caption" fontWeight={700}
                            sx={{ color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Saved Trips
                        </Typography>
                    </Box>
                    {savedTrips.length === 0
                        ? <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.22)', pl: 0.5 }}>
                            No saved trips yet
                          </Typography>
                        : savedTrips.map(trip => (
                            <Box key={trip.id} onClick={() => router.visit(`/trips/${trip.id}`)}
                                sx={{ px: 1.5, py: 0.9, borderRadius: 1.5, mb: 0.5, cursor: 'pointer',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}>
                                <Typography variant="body2" noWrap sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }}>
                                    {trip.trip_title}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)' }}>
                                    {trip.route_name}
                                </Typography>
                            </Box>
                        ))
                    }
                </Box>
            </Box>
        </Box>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIND YOUR ROUTE — debounced filter section at bottom of page
// ─────────────────────────────────────────────────────────────────────────────
function FindYourRoute() {
    const [filters, setFilters] = useState({
        search: '', region_id: '', difficulty: '',
        duration_max: 30, altitude_max: 9000, permit: false,
    });
    const [results,   setResults]   = useState(DUMMY_ROUTES);
    const [searching, setSearching] = useState(false);
    const [touched,   setTouched]   = useState(false);
    const debounceRef = useRef(null);

    const set = (key, val) => {
        setTouched(true);
        setFilters(prev => ({ ...prev, [key]: val }));
    };

    useEffect(() => {
        if (!touched) return;
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearching(true);
            axios.get('/api/routes/filter', {
                params: {
                    search:       filters.search       || undefined,
                    region_id:    filters.region_id    || undefined,
                    difficulty:   filters.difficulty   || undefined,
                    duration_max: filters.duration_max,
                    altitude_max: filters.altitude_max,
                    permit:       filters.permit ? 1 : undefined,
                },
            })
            .then(res => setResults(res.data))
            .catch(() => {
                // API not wired yet — fall back to local dummy filter
                setResults(DUMMY_ROUTES.filter(r =>
                    (!filters.search     || r.trekking_route_name.toLowerCase().includes(filters.search.toLowerCase())) &&
                    (!filters.difficulty || r.difficulty === filters.difficulty) &&
                    r.duration_days  <= filters.duration_max &&
                    r.max_altitude   <= filters.altitude_max &&
                    (!filters.permit || r.permit_required)
                ));
            })
            .finally(() => setSearching(false));
        }, 500);
        return () => clearTimeout(debounceRef.current);
    }, [filters]);

    return (
        <Box id="find-your-route" sx={{ mb: 6, scrollMarginTop: '80px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <TuneIcon sx={{ color: 'primary.main' }} />
                <Box>
                    <Typography variant="h6" fontWeight={700}>Find Your Route</Typography>
                    <Typography variant="caption" color="text.secondary">
                        Results update as you adjust — 500ms debounced search
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>

                {/* Filter panel */}
                <Paper variant="outlined"
                    sx={{ p: 2.5, borderRadius: 3, width: { xs: '100%', md: 260 },
                        flexShrink: 0, alignSelf: 'flex-start',
                        position: { md: 'sticky' }, top: { md: 80 } }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary"
                        sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', mb: 2.5 }}>
                        Filters
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField placeholder="Search routes…" value={filters.search}
                            onChange={e => set('search', e.target.value)} size="small"
                            InputProps={{ startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            )}} />

                        <FormControl fullWidth size="small">
                            <InputLabel>Region</InputLabel>
                            <Select label="Region" value={filters.region_id}
                                onChange={e => set('region_id', e.target.value)}>
                                <MenuItem value="">Any Region</MenuItem>
                                {DUMMY_REGIONS.map(r => (
                                    <MenuItem key={r.id} value={r.id}>{r.region_name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel>Difficulty</InputLabel>
                            <Select label="Difficulty" value={filters.difficulty}
                                onChange={e => set('difficulty', e.target.value)}>
                                <MenuItem value="">Any Difficulty</MenuItem>
                                {Object.entries(DIFFICULTY_MAP).map(([val, cfg]) => (
                                    <MenuItem key={val} value={val}>{cfg.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box>
                            <Typography variant="body2" fontWeight={500} gutterBottom>
                                Max Duration: <strong>{filters.duration_max} days</strong>
                            </Typography>
                            <Slider value={filters.duration_max} min={1} max={60} step={1} size="small"
                                onChange={(_, v) => set('duration_max', v)} />
                        </Box>

                        <Box>
                            <Typography variant="body2" fontWeight={500} gutterBottom>
                                Max Altitude: <strong>{filters.altitude_max.toLocaleString()}m</strong>
                            </Typography>
                            <Slider value={filters.altitude_max} min={1000} max={9000} step={100} size="small"
                                onChange={(_, v) => set('altitude_max', v)} />
                        </Box>

                        <FormControlLabel
                            control={<Switch checked={filters.permit} size="small" color="primary"
                                onChange={e => set('permit', e.target.checked)} />}
                            label={<Typography variant="body2">Permit Required</Typography>}
                        />
                    </Box>
                </Paper>

                {/* Results grid */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, minHeight: 24 }}>
                        {searching
                            ? <><CircularProgress size={14} /><Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>Searching…</Typography></>
                            : <Typography variant="caption" color="text.secondary">
                                {results.length} route{results.length !== 1 ? 's' : ''} found
                              </Typography>
                        }
                    </Box>

                    {!searching && results.length === 0 && (
                        <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
                            No routes match your filters — try loosening the criteria.
                        </Alert>
                    )}

                    <Box sx={{ display: 'grid', gap: 2,
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' } }}>
                        {results.map(r => <RouteCard key={r.id} route={r} />)}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
    const { auth }  = usePage().props;
    const user      = auth?.user;
    const theme     = useTheme();
    const isMobile  = useMediaQuery(theme.breakpoints.down('sm'));

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [plannerOpen, setPlannerOpen] = useState(false);

    return (
        <>
            <Head title="Home — TrekSathi" />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Navbar user={user} />

                <Box sx={{ display: 'flex', flex: 1, pt: '64px' }}>

                    {/* Sidebar */}
                    <Sidebar
                        open={!isMobile && sidebarOpen}
                        chatSessions={DUMMY_CHAT_SESSIONS}
                        savedTrips={DUMMY_SAVED_TRIPS}
                        onPlanTrip={() => setPlannerOpen(true)}
                    />

                    {/* Sidebar toggle (desktop only) */}
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
                        {/* Mobile Plan a Trip */}
                        <Box sx={{ display: { xs: 'flex', sm: 'none' }, mb: 3 }}>
                            <Button variant="contained" startIcon={<AddIcon />}
                                onClick={() => setPlannerOpen(true)}>
                                Plan a Trip
                            </Button>
                        </Box>

                        {/* Welcome */}
                        {user && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h4" fontWeight={700}>
                                    Welcome back, {user.name.split(' ')[0]} 👋
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Discover your next trek or pick up where you left off.
                                </Typography>
                            </Box>
                        )}

                        {/* ── Regions ── */}
                        <ScrollSection title="Explore Regions" emoji="🗺️"
                            subtitle="Click a region to see all routes, permits and details"
                            itemCount={DUMMY_REGIONS.length}>
                            {DUMMY_REGIONS.map(r => <ScrollCard key={r.id}><RegionCard region={r} /></ScrollCard>)}
                        </ScrollSection>

                        <Divider sx={{ mb: 6 }} />

                        {/* ── Trekking Routes ── */}
                        <ScrollSection title="Popular Trekking Routes" emoji="🏔️"
                            subtitle="Top routes across Nepal — click for full details"
                            itemCount={DUMMY_ROUTES.length}>
                            {DUMMY_ROUTES.map(r => <ScrollCard key={r.id}><RouteCard route={r} /></ScrollCard>)}
                        </ScrollSection>

                        <Divider sx={{ mb: 6 }} />

                        {/* ── Tea Houses ── */}
                        <ScrollSection title="Tea Houses" emoji="🏠"
                            subtitle="Accommodation along the trails"
                            itemCount={DUMMY_TEAHOUSES.length}>
                            {DUMMY_TEAHOUSES.map(h => <ScrollCard key={h.id}><TeaHouseCard house={h} /></ScrollCard>)}
                        </ScrollSection>

                        <Divider sx={{ mb: 6 }} />

                        {/* ── Find Your Route ── */}
                        <FindYourRoute />
                    </Box>
                </Box>

                {/* Footer follows content margin */}
                <Box sx={{
                    ml: (!isMobile && sidebarOpen) ? `${SIDEBAR_W}px` : 0,
                    transition: 'margin-left 0.25s ease',
                }}>
                    <Footer />
                </Box>
            </Box>

            <PlanTripModal open={plannerOpen} onClose={() => setPlannerOpen(false)} />
        </>
    );
}
