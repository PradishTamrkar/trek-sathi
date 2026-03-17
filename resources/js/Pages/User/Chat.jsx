import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import {
    Box, Typography, Button, IconButton, Paper,
    TextField, InputAdornment, useTheme, useMediaQuery,
} from '@mui/material';
import ChevronLeftIcon  from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutoAwesomeIcon  from '@mui/icons-material/AutoAwesome';
import SendIcon         from '@mui/icons-material/Send';
import TerrainIcon      from '@mui/icons-material/Terrain';
import Navbar           from '../../Components/User/Navbar';
import UserSidebar, { SIDEBAR_W } from '../../Components/User/UserSidebar';

// ── Suggestion chips shown on empty chat ─────────────────────────────────────
const SUGGESTIONS = [
    '🏔️ Plan an Everest Base Camp trek for October',
    '🗺️ What\'s the best season for Annapurna Circuit?',
    '📋 What permits do I need for Langtang?',
    '🏠 Recommend tea houses along EBC route',
    '💪 I\'m a beginner — which route suits me?',
    '⏱️ 7-day trek options from Kathmandu',
];

// ── Empty / welcome state ────────────────────────────────────────────────────
function EmptyState({ onSuggestionClick }) {
    return (
        <Box sx={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            px: { xs: 2, md: 6 }, py: 4, textAlign: 'center',
        }}>
            {/* Logo mark */}
            <Box sx={{
                width: 72, height: 72, borderRadius: 3,
                background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mb: 3, boxShadow: '0 8px 24px rgba(46,125,50,0.25)',
            }}>
                <TerrainIcon sx={{ fontSize: 36, color: 'white' }} />
            </Box>

            <Typography variant="h5" fontWeight={700} gutterBottom>
                Your AI Trek Planner
            </Typography>
            <Typography variant="body1" color="text.secondary"
                sx={{ maxWidth: 420, lineHeight: 1.8, mb: 4 }}>
                Ask me anything about trekking in Nepal — routes, permits, seasons,
                tea houses, altitude sickness, gear, or a full personalised itinerary.
            </Typography>

            {/* Suggestion chips */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1.5, width: '100%', maxWidth: 640,
            }}>
                {SUGGESTIONS.map(s => (
                    <Paper
                        key={s}
                        variant="outlined"
                        onClick={() => onSuggestionClick(s.replace(/^[^\s]+\s/, ''))}
                        sx={{
                            p: 1.5, borderRadius: 2.5, cursor: 'pointer',
                            textAlign: 'left', transition: 'all 0.15s',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: '#f9fff9',
                                transform: 'translateY(-1px)',
                            },
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                            {s}
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}

// ── Main chat page ────────────────────────────────────────────────────────────
export default function Chat({ sessionId = null }) {
    const { auth } = usePage().props;
    const user     = auth?.user;
    const theme    = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [input,       setInput]       = useState('');
    const [messages,    setMessages]    = useState([]);   // { role: 'user'|'assistant', content: string }
    const [loading,     setLoading]     = useState(false);

    // Replace with real props from ChatController
    const chatSessions = [];
    const savedTrips   = [];

    const handleSend = (text) => {
        const content = (text ?? input).trim();
        if (!content || loading) return;
        setInput('');

        // Append user message
        setMessages(prev => [...prev, { role: 'user', content }]);

        // TODO: POST to /api/chat with session_id, get streaming response
        // For now show a placeholder assistant response
        setLoading(true);
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '🚧 AI chat is coming soon! The backend streaming endpoint is being set up. Your message was received.',
            }]);
            setLoading(false);
        }, 800);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <Head title="Plan with AI — TrekSathi" />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.50' }}>
                <Navbar user={user} />

                <Box sx={{ display: 'flex', flex: 1, pt: '64px', minHeight: 0 }}>

                    {/* Sidebar */}
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

                        {/* Messages or empty state */}
                        {messages.length === 0 ? (
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
                                        {/* Assistant avatar */}
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
                                        <Paper
                                            variant={msg.role === 'user' ? 'elevation' : 'outlined'}
                                            elevation={msg.role === 'user' ? 0 : 0}
                                            sx={{
                                                maxWidth: '72%',
                                                px: 2.5, py: 1.5, borderRadius: 3,
                                                bgcolor: msg.role === 'user' ? 'primary.main' : 'white',
                                                borderColor: msg.role === 'user' ? 'transparent' : 'grey.200',
                                                borderTopRightRadius: msg.role === 'user' ? 4 : 24,
                                                borderTopLeftRadius: msg.role === 'assistant' ? 4 : 24,
                                            }}
                                        >
                                            <Typography variant="body2"
                                                sx={{
                                                    color: msg.role === 'user' ? 'white' : 'text.primary',
                                                    lineHeight: 1.7, whiteSpace: 'pre-wrap',
                                                }}>
                                                {msg.content}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                ))}

                                {/* Loading indicator */}
                                {loading && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{
                                            width: 32, height: 32, borderRadius: 1.5,
                                            background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <TerrainIcon sx={{ fontSize: 16, color: 'white' }} />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                            {[0, 1, 2].map(i => (
                                                <Box key={i} sx={{
                                                    width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main',
                                                    animation: 'pulse 1.2s ease-in-out infinite',
                                                    animationDelay: `${i * 0.2}s`,
                                                    '@keyframes pulse': {
                                                        '0%, 80%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
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
                            borderTop: '1px solid', borderColor: 'divider',
                            bgcolor: 'white',
                        }}>
                            <Box sx={{
                                display: 'flex', gap: 1.5, alignItems: 'flex-end',
                                maxWidth: 800, mx: 'auto',
                            }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                    placeholder="Ask about any Nepal trek — routes, permits, seasons, gear…"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={loading}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'grey.50' },
                                    }}
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
                                    }}
                                >
                                    <SendIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Typography variant="caption" color="text.disabled"
                                sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                                Press Enter to send · Shift+Enter for new line
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
