import { Head, router, usePage, useForm } from '@inertiajs/react';
import { useRef } from 'react';
import {
    Box, Typography, Chip, Paper, Button, Divider, Grid,
    Alert, Snackbar, IconButton, Tooltip,
    useForkRef,
} from '@mui/material';
import ArrowBackIcon      from '@mui/icons-material/ArrowBack';
import DownloadIcon       from '@mui/icons-material/Download';
import DeleteOutlineIcon  from '@mui/icons-material/DeleteOutline';
import TerrainIcon        from '@mui/icons-material/Terrain';
import CalendarMonthIcon  from '@mui/icons-material/CalendarMonth';
import TimerIcon          from '@mui/icons-material/Timer';
import ArticleIcon        from '@mui/icons-material/Article';
import CheckCircleIcon    from '@mui/icons-material/CheckCircle';
import HouseIcon          from '@mui/icons-material/House';
import AutoAwesomeIcon    from '@mui/icons-material/AutoAwesome';
import Navbar             from '../../../Components/User/Navbar';
import Footer             from '../../../Components/User/Footer';
import { useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';

const DIFFICULTY_MAP = {
    easy:     { label: 'Easy',      bg: '#e8f5e9', color: '#2e7d32' },
    moderate: { label: 'Moderate',  bg: '#fff8e1', color: '#e65100' },
    hard:     { label: 'Hard',      bg: '#fce4ec', color: '#c62828' },
    hellmode: { label: 'Hell Mode', bg: '#1a0000', color: '#ff1744' },
};

//PDF printable content wrapper
function PrintableTrip({trip, printRef}){
    const route=trip.trekking_route;
    const plan=trip.itinerary_json;
    const days=plan.days ?? route?.route_days ?? [];
    const permits=route?.permits ?? [];
    const cfg = DIFFICULTY_MAP[route?.difficulty] ?? { label: route?.difficulty, bg: '#f5f5f5', color: '#555' };

    return (
         <Box ref={printRef} sx={{ p: { xs: 0, print: 4 } }}>
            {/* ── Trip header ── */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0d1f14 0%, #1a3a2f 100%)',
                borderRadius: { xs: 3, print: 0 }, p: 4, mb: 4,
                '@media print': { borderRadius: 0, mb: 2 },
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <TerrainIcon sx={{ color: 'secondary.main', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)',
                        textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        TrekSathi · Saved Trip Plan
                    </Typography>
                </Box>
                <Typography variant="h4" fontWeight={800}
                    sx={{ color: 'white', fontFamily: 'Georgia, serif', mb: 0.5 }}>
                    {trip.trip_title}
                </Typography>
                {route && (
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {route.trekking_route_name} · {route.regions?.region_name}
                    </Typography>
                )}

                {/* Quick stats */}
                {route && (
                    <Box sx={{ display: 'flex', gap: 2.5, mt: 3, flexWrap: 'wrap' }}>
                        {[
                            { icon: <TimerIcon sx={{ fontSize: 15 }} />,         label: `${route.duration_days} days` },
                            { icon: <TerrainIcon sx={{ fontSize: 15 }} />,        label: `${Number(route.max_altitude).toLocaleString()}m max altitude` },
                            { icon: <CalendarMonthIcon sx={{ fontSize: 15 }} />,  label: route.best_season },
                        ].map((item, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <Box sx={{ color: 'secondary.main' }}>{item.icon}</Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                                    {item.label}
                                </Typography>
                            </Box>
                        ))}
                        <Chip label={cfg.label} size="small"
                            sx={{ fontSize: '0.68rem', height: 20, bgcolor: cfg.bg, color: cfg.color, fontWeight: 700 }} />
                    </Box>
                )}
            </Box>

            <Grid container spacing={4}>
                {/* Left: AI plan or day itinerary */}
                <Grid item xs={12} md={7}>

                    {/* AI-generated overview if present */}
                    {plan.overview && (
                        <Paper variant="outlined" sx={{ borderRadius: 3, p: 3, mb: 3,
                            bgcolor: '#f9fff9', borderColor: '#c8e6c9' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <AutoAwesomeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
                                    AI Trip Overview
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                {plan.overview}
                            </Typography>
                        </Paper>
                    )}

                    {/* Day-by-day */}
                    {days.length > 0 && (
                        <>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                Day-by-Day Itinerary
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {days.map((day, idx) => (
                                    <Paper key={day.id ?? idx} variant="outlined" sx={{ borderRadius: 2.5, p: 2.5 }}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                            <Box sx={{
                                                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                                bgcolor: 'primary.main', color: 'white',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.85rem', fontWeight: 700,
                                            }}>
                                                {day.day_number ?? idx + 1}
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" fontWeight={700}>
                                                    {day.start_point} → {day.end_point}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 2, mt: 0.5, mb: 1, flexWrap: 'wrap' }}>
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
                                                {day.days_description && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                                        {day.days_description}
                                                    </Typography>
                                                )}
                                                {/* Tea houses */}
                                                {day.tea_house?.length > 0 && (
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                                        {day.tea_house.map(h => (
                                                            <Chip key={h.id}
                                                                icon={<HouseIcon sx={{ fontSize: '13px !important' }} />}
                                                                label={`${h.house_name}${h.cost_per_night ? ` · $${h.cost_per_night}/night` : ''}`}
                                                                size="small"
                                                                sx={{ fontSize: '0.67rem', height: 22,
                                                                    bgcolor: '#f5f5f5' }} />
                                                        ))}
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </>
                    )}

                    {/* AI-generated packing list if present */}
                    {plan.packing_list?.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Packing List</Typography>
                            <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
                                <Grid container spacing={1}>
                                    {plan.packing_list.map((item, i) => (
                                        <Grid item xs={12} sm={6} key={i}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircleIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                                                <Typography variant="body2" color="text.secondary">{item}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Box>
                    )}

                    {/* AI tips if present */}
                    {plan.tips && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Tips & Advice</Typography>
                            <Paper variant="outlined" sx={{ borderRadius: 3, p: 3, bgcolor: '#fff8e1', borderColor: '#ffe082' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                    {plan.tips}
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                </Grid>

                {/* Right: summary card + permits */}
                <Grid item xs={12} md={5}>
                    <Paper variant="outlined" sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Trip Summary</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box>
                                <Typography variant="caption" color="text.disabled">Saved on</Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {new Date(trip.created_at).toLocaleDateString('en-US', {
                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                    })}
                                </Typography>
                            </Box>
                            {route && (
                                <>
                                    <Box>
                                        <Typography variant="caption" color="text.disabled">Route</Typography>
                                        <Typography variant="body2" fontWeight={600}>{route.trekking_route_name}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.disabled">Region</Typography>
                                        <Typography variant="body2" fontWeight={600}>{route.regions?.region_name ?? '—'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.disabled">Duration</Typography>
                                        <Typography variant="body2" fontWeight={600}>{route.duration_days} days</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.disabled">Best Season</Typography>
                                        <Typography variant="body2" fontWeight={600}>{route.best_season}</Typography>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Paper>

                    {/* Permits */}
                    {permits.length > 0 && (
                        <Paper variant="outlined" sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <ArticleIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                <Typography variant="subtitle2" fontWeight={700}>Permits Required</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            {permits.map(p => (
                                <Box key={p.id} sx={{
                                    display: 'flex', justifyContent: 'space-between', py: 1,
                                    borderBottom: '1px solid', borderColor: 'divider',
                                    '&:last-child': { borderBottom: 'none', pb: 0 },
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircleIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                                        <Typography variant="caption">{p.permit_name}</Typography>
                                    </Box>
                                    <Typography variant="caption" fontWeight={700} color="primary.main">
                                        {p.price_in_usd ? `$${p.price_in_usd}` : '—'}
                                    </Typography>
                                </Box>
                            ))}
                            {permits.length > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5,
                                    borderTop: '1px solid', borderColor: 'divider', mt: 0.5 }}>
                                    <Typography variant="caption" fontWeight={700}>Total</Typography>
                                    <Typography variant="caption" fontWeight={700} color="primary.main">
                                        ${permits.reduce((sum, p) => sum + (Number(p.price_in_usd) || 0), 0)}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    )}

                    {/* AI budget if present */}
                    {plan.estimated_budget && (
                        <Paper variant="outlined" sx={{ borderRadius: 3, p: 3, mb: 3,
                            bgcolor: '#e8f5e9', borderColor: '#c8e6c9' }}>
                            <Typography variant="subtitle2" fontWeight={700} color="primary.dark" gutterBottom>
                                Estimated Budget
                            </Typography>
                            <Typography variant="h5" fontWeight={800} color="primary.main">
                                {plan.estimated_budget}
                            </Typography>
                            {plan.budget_note && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                    {plan.budget_note}
                                </Typography>
                            )}
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}

//Main Page
export default function SavedTripShow({trip}){
    const {auth, flash}=usePage().props;
    const printRef=useRef(null);
    const {delete:destory, processing}=useForm();
    const [snackbar,setSnackbar]=useState(!!flash?.success);
    const [deleteConfirm,setDeleteConfirm]=useState(false);

    const handlePrint=()=>{
        window.print();
    }

    const handleDelete=()=>{
        destory(route('trips.destroy',trip.id),{
            onSuccess: () => router.visit('/home'),
        });
    };

    return (
         <>
            <Head title={`${trip.trip_title} — TrekSathi`} />

            {/* Print-only styles */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>

            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Box className="no-print">
                    <Navbar user={auth?.user} />
                </Box>

                <Box sx={{ pt: { xs: '64px', print: 0 } }}>
                    {/* Toolbar */}
                    <Box className="no-print" sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        px: { xs: 2, md: 6 }, py: 2,
                        bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider',
                        position: 'sticky', top: 64, zIndex: 10,
                    }}>
                        <Button startIcon={<ArrowBackIcon />} onClick={() => router.visit('/home')}
                            sx={{ color: 'text.secondary' }}>
                            Back to Home
                        </Button>

                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            {!deleteConfirm ? (
                                <Tooltip title="Delete this trip">
                                    <IconButton onClick={() => setDeleteConfirm(true)}
                                        size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Typography variant="caption" color="error.main">Delete this trip?</Typography>
                                    <Button size="small" color="error" variant="contained"
                                        disabled={processing} onClick={handleDelete}>
                                        {processing ? 'Deleting…' : 'Yes, Delete'}
                                    </Button>
                                    <Button size="small" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                                </Box>
                            )}
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={handlePrint}
                                sx={{ px: 3 }}>
                                Download PDF
                            </Button>
                        </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 5 }, py: 4 }}>
                        <PrintableTrip trip={trip} printRef={printRef} />
                    </Box>
                </Box>

                <Box className="no-print">
                    <Footer />
                </Box>
            </Box>

            <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="success" onClose={() => setSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {flash?.success}
                </Alert>
            </Snackbar>
        </>
    );
}
