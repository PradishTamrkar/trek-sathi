import { useState } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import {
    Box, Typography, Button, IconButton, Paper,
    TextField, useTheme, useMediaQuery, Dialog, DialogTitle,
    DialogContent, DialogActions, Divider, Alert, Snackbar,
    FormControl, InputLabel, Select, MenuItem, FormHelperText,
    Chip,
} from '@mui/material';
import ChevronLeftIcon  from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SendIcon         from '@mui/icons-material/Send';
import TerrainIcon      from '@mui/icons-material/Terrain';
import BookmarkIcon     from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Navbar           from '../../Components/User/Navbar';
import UserSidebar, { SIDEBAR_W } from '../../Components/User/UserSidebar';

// ── Suggestion chips ──────────────────────────────────────────────────────────
const SUGGESTIONS = [
    '🏔️ Plan an Everest Base Camp trek for October',
    '🗺️ What\'s the best season for Annapurna Circuit?',
    '📋 What permits do I need for Langtang?',
    '🏠 Recommend tea houses along EBC route',
    '💪 I\'m a beginner — which route suits me?',
    '⏱️ 7-day trek options from Kathmandu',
];

function EmptyState({ onSuggestionClick }) {
    return (
        <Box sx={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            px: { xs: 2, md: 6 }, py: 4, textAlign: 'center',
        }}>
            <Box sx={{
                width: 72, height: 72, borderRadius: 3,
                background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mb: 3, boxShadow: '0 8px 24px rgba(46,125,50,0.25)',
            }}>
                <TerrainIcon sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>Your AI Trek Planner</Typography>
            <Typography variant="body1" color="text.secondary"
                sx={{ maxWidth: 420, lineHeight: 1.8, mb: 4 }}>
                Ask me anything about trekking in Nepal — routes, permits, seasons,
                tea houses, altitude sickness, gear, or a full personalised itinerary.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, width: '100%', maxWidth: 640 }}>
                {SUGGESTIONS.map(s => (
                    <Paper key={s} variant="outlined"
                        onClick={() => onSuggestionClick(s.replace(/^[^\s]+\s/, ''))}
                        sx={{ p: 1.5, borderRadius: 2.5, cursor: 'pointer', textAlign: 'left',
                            transition: 'all 0.15s',
                            '&:hover': { borderColor: 'primary.main', bgcolor: '#f9fff9', transform: 'translateY(-1px)' } }}>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>{s}</Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}

// ── Save Trip Dialog ──────────────────────────────────────────────────────────
function SaveTripDialog({ open, onClose, trekkingRoutes, messages }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        trekking_route_id: '',
        trip_title:        '',
        itinerary_json:    {},
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Build a simple itinerary_json from the conversation
        // When AI is integrated, this will be structured data from the AI response
        const itinerary = {
            overview: messages
                .filter(m => m.role === 'assistant')
                .map(m => m.content)
                .join('\n\n')
                .slice(0, 2000),
            generated_from_chat: true,
            messages_count: messages.length,
            saved_at: new Date().toISOString(),
        };

        post(route('trips.store'), {
            data: {
                trekking_route_id: data.trekking_route_id,
                trip_title:        data.trip_title,
                itinerary_json:    itinerary,
            },
            onSuccess: () => { reset(); onClose(true); },
        });
    };

    const handleClose = () => { reset(); onClose(false); };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BookmarkIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="h6" fontWeight={700}>Save This Trip Plan</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    Save the conversation to your trip list to review anytime.
                </Typography>
            </DialogTitle>
            <Divider />
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
                    <TextField
                        label="Trip Name"
                        value={data.trip_title}
                        onChange={e => setData('trip_title', e.target.value)}
                        error={!!errors.trip_title}
                        helperText={errors.trip_title}
                        required autoFocus
                        placeholder="e.g. My EBC Trek — October 2025"
                    />
                    <FormControl fullWidth size="small" error={!!errors.trekking_route_id} required>
                        <InputLabel>Trekking Route</InputLabel>
                        <Select label="Trekking Route" value={data.trekking_route_id}
                            onChange={e => setData('trekking_route_id', e.target.value)}>
                            {trekkingRoutes.map(r => (
                                <MenuItem key={r.id} value={r.id}>{r.trekking_route_name}</MenuItem>
                            ))}
                        </Select>
                        {errors.trekking_route_id && <FormHelperText>{errors.trekking_route_id}</FormHelperText>}
                    </FormControl>
                    <Alert severity="info" sx={{ borderRadius: 2, fontSize: '0.8rem' }}>
                        The AI conversation will be saved and linked to your trip plan. Once AI is fully integrated,
                        structured itinerary data will be saved automatically.
                    </Alert>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button onClick={handleClose} color="inherit" disabled={processing}>Cancel</Button>
                    <Button type="submit" variant="contained" startIcon={<BookmarkIcon />} disabled={processing}>
                        {processing ? 'Saving…' : 'Save Trip'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

// ── Main chat page ────────────────────────────────────────────────────────────
export default function Chat({ sessionId = null, chatSessions = [], savedTrips = [], trekkingRoutes = [] }) {
    const { auth, flash } = usePage().props;
    const user     = auth?.user;
    const theme    = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [sidebarOpen,  setSidebarOpen]  = useState(true);
    const [input,        setInput]        = useState('');
    const [messages,     setMessages]     = useState([]);
    const [loading,      setLoading]      = useState(false);
    const [saveDialog,   setSaveDialog]   = useState(false);
    const [snackbar,     setSnackbar]     = useState(!!flash?.success);
    const [savedMsg,     setSavedMsg]     = useState('');

    const hasMessages = messages.length > 0;

    const handleSend = (text) => {
        const content = (text ?? input).trim();
        if (!content || loading) return;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content }]);
        setLoading(true);
        // TODO: replace with real streaming API call
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '🚧 AI chat is coming soon! The backend streaming endpoint is being set up. Your message was received.',
            }]);
            setLoading(false);
        }, 800);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const handleSaveClose = (saved) => {
        setSaveDialog(false);
        if (saved) {
            setSavedMsg('Trip saved! Find it in your sidebar under Saved Trips.');
            setSnackbar(true);
        }
    };

    return (
        <>
            <Head title="Plan with AI — TrekSathi" />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.50' }}>
                <Navbar user={user} />

                <Box sx={{ display: 'flex', flex: 1, pt: '64px', minHeight: 0 }}>
                    <UserSidebar
                        open={!isMobile && sidebarOpen}
                        chatSessions={chatSessions}
                        savedTrips={savedTrips}
                        activePage="chat"
                        activeSessionId={sessionId}
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

                    {/* Chat area */}
                    <Box sx={{
                        flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
                        ml: (!isMobile && sidebarOpen) ? `${SIDEBAR_W}px` : 0,
                        transition: 'margin-left 0.25s ease',
                    }}>
                        {/* Chat toolbar — only shows when there are messages */}
                        {hasMessages && user && (
                            <Box sx={{
                                display: 'flex', justifyContent: 'flex-end',
                                px: { xs: 2, md: 6 }, py: 1.5,
                                borderBottom: '1px solid', borderColor: 'divider',
                                bgcolor: 'white',
                            }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<BookmarkBorderIcon />}
                                    onClick={() => setSaveDialog(true)}
                                    sx={{ borderRadius: 2 }}>
                                    Save This Trip Plan
                                </Button>
                            </Box>
                        )}

                        {/* Messages or empty state */}
                        {!hasMessages ? (
                            <EmptyState onSuggestionClick={handleSend} />
                        ) : (
                            <Box sx={{
                                flex: 1, overflowY: 'auto', px: { xs: 2, md: 6 }, py: 3,
                                display: 'flex', flexDirection: 'column', gap: 3,
                            }}>
                                {messages.map((msg, i) => (
                                    <Box key={i} sx={{
                                        display: 'flex',
                                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    }}>
                                        {msg.role === 'assistant' && (
                                            <Box sx={{
                                                width: 32, height: 32, borderRadius: 1.5, flexShrink: 0,
                                                background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                mr: 1.5, mt: 0.5,
                                            }}>
                                                <TerrainIcon sx={{ fontSize: 16, color: 'white' }} />
                                            </Box>
                                        )}
                                        <Paper variant="outlined" sx={{
                                            maxWidth: '72%', px: 2.5, py: 1.5, borderRadius: 3,
                                            bgcolor: msg.role === 'user' ? 'primary.main' : 'white',
                                            borderColor: msg.role === 'user' ? 'transparent' : 'grey.200',
                                            borderTopRightRadius: msg.role === 'user' ? 4 : 24,
                                            borderTopLeftRadius:  msg.role === 'assistant' ? 4 : 24,
                                        }}>
                                            <Typography variant="body2" sx={{
                                                color: msg.role === 'user' ? 'white' : 'text.primary',
                                                lineHeight: 1.7, whiteSpace: 'pre-wrap',
                                            }}>
                                                {msg.content}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                ))}
                                {loading && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{
                                            width: 32, height: 32, borderRadius: 1.5,
                                            background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <TerrainIcon sx={{ fontSize: 16, color: 'white' }} />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {[0, 1, 2].map(i => (
                                                <Box key={i} sx={{
                                                    width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main',
                                                    animation: 'pulse 1.2s ease-in-out infinite',
                                                    animationDelay: `${i * 0.2}s`,
                                                    '@keyframes pulse': {
                                                        '0%,80%,100%': { opacity: 0.2, transform: 'scale(0.8)' },
                                                        '40%': { opacity: 1, transform: 'scale(1)' },
                                                    },
                                                }} />
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Input bar */}
                        <Box sx={{
                            px: { xs: 2, md: 6 }, py: 2.5,
                            borderTop: '1px solid', borderColor: 'divider', bgcolor: 'white',
                        }}>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', maxWidth: 800, mx: 'auto' }}>
                                <TextField
                                    fullWidth multiline maxRows={4}
                                    placeholder="Ask about any Nepal trek — routes, permits, seasons, gear…"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={loading}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'grey.50' } }}
                                />
                                <IconButton
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || loading}
                                    sx={{
                                        width: 48, height: 48, flexShrink: 0,
                                        bgcolor: input.trim() && !loading ? 'primary.main' : 'grey.200',
                                        color: input.trim() && !loading ? 'white' : 'text.disabled',
                                        borderRadius: 2.5, transition: 'all 0.2s',
                                        '&:hover': { bgcolor: input.trim() ? 'primary.dark' : 'grey.200' },
                                        '&:disabled': { bgcolor: 'grey.200', color: 'text.disabled' },
                                    }}>
                                    <SendIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Typography variant="caption" color="text.disabled"
                                sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                                Press Enter to send · Shift+Enter for new line
                                {hasMessages && user && ' · Click "Save This Trip Plan" to save to your trips'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Save trip dialog */}
            <SaveTripDialog
                open={saveDialog}
                onClose={handleSaveClose}
                trekkingRoutes={trekkingRoutes}
                messages={messages}
            />

            <Snackbar open={snackbar} autoHideDuration={4000} onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="success" onClose={() => setSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {savedMsg || flash?.success}
                </Alert>
            </Snackbar>
        </>
    );
}
