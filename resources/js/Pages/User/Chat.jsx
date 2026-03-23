import { useState, useRef, useEffect, useCallback } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import {
    Box, Typography, Button, IconButton, Paper,
    TextField, useTheme, useMediaQuery, Dialog, DialogTitle,
    DialogContent, DialogActions, Divider, Alert, Snackbar,
    FormControl, InputLabel, Select, MenuItem, FormHelperText,
    Chip, CircularProgress,
} from '@mui/material';
import ChevronLeftIcon    from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon   from '@mui/icons-material/ChevronRight';
import SendIcon           from '@mui/icons-material/Send';
import TerrainIcon        from '@mui/icons-material/Terrain';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon       from '@mui/icons-material/Bookmark';
import StopIcon           from '@mui/icons-material/Stop';
import Navbar             from '../../Components/User/Navbar';
import UserSidebar, { SIDEBAR_W } from '../../Components/User/UserSidebar';

// ── Suggestion chips ──────────────────────────────────────────────────────────
const SUGGESTIONS = [
    '🏔️ Plan an Everest Base Camp trek for October',
    '🗺️ Best season for Annapurna Circuit?',
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

// ── Markdown-ish renderer for assistant messages ──────────────────────────────
function MessageContent({ content }) {
    const lines = content.split('\n');
    return (
        <Box>
            {lines.map((line, i) => {
                if (line.startsWith('### ')) return (
                    <Typography key={i} variant="body2" fontWeight={700} sx={{ mt: 1, mb: 0.5, fontSize: '0.9rem' }}>
                        {line.slice(4)}
                    </Typography>
                );
                if (line.startsWith('## ')) return (
                    <Typography key={i} variant="body2" fontWeight={700} sx={{ mt: 1.5, mb: 0.5, fontSize: '0.95rem' }}>
                        {line.slice(3)}
                    </Typography>
                );
                if (line.startsWith('- ') || line.startsWith('* ')) return (
                    <Box key={i} sx={{ display: 'flex', gap: 0.75, mb: 0.25 }}>
                        <Typography variant="body2" color="text.disabled">•</Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{line.slice(2)}</Typography>
                    </Box>
                );
                if (line === '') return <Box key={i} sx={{ height: 8 }} />;
                return (
                    <Typography key={i} variant="body2" sx={{ lineHeight: 1.7 }}>
                        {line.replace(/\*\*(.*?)\*\*/g, '').replace(/\*(.*?)\*/g, '')}
                    </Typography>
                );
            })}
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

    return (
        <Dialog open={open} onClose={() => { reset(); onClose(false); }} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BookmarkIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="h6" fontWeight={700}>Save This Trip Plan</Typography>
                </Box>
            </DialogTitle>
            <Divider />
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
                    <TextField label="Trip Name" value={data.trip_title}
                        onChange={e => setData('trip_title', e.target.value)}
                        error={!!errors.trip_title} helperText={errors.trip_title}
                        required autoFocus placeholder="e.g. My EBC Trek — October 2025" />
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
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button onClick={() => { reset(); onClose(false); }} color="inherit" disabled={processing}>Cancel</Button>
                    <Button type="submit" variant="contained" startIcon={<BookmarkIcon />} disabled={processing}>
                        {processing ? 'Saving…' : 'Save Trip'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

// ── Main Chat Page ────────────────────────────────────────────────────────────
export default function Chat({
    sessionId     = null,
    messages:     initialMessages = [],
    chatSessions  = [],
    savedTrips    = [],
    trekkingRoutes = [],
}) {
    const { auth, flash } = usePage().props;
    const user     = auth?.user;
    const theme    = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


    // Hydrate from server-side messages (when resuming a session)
    const [messages,    setMessages]    = useState(initialMessages ?? []);
    const [input,       setInput]       = useState('');
    const [streaming,   setStreaming]   = useState(false);
    const [activeId,    setActiveId]    = useState(sessionId);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [saveDialog,  setSaveDialog]  = useState(false);
    const [snackbar,    setSnackbar]    = useState(!!flash?.success);
    const [savedMsg,    setSavedMsg]    = useState('');

    const abortRef   = useRef(null);
    const bottomRef  = useRef(null);
    const hasMessages = messages.length > 0;

    // Scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message
    const msgIdRef = useRef(1);

const handleSend = useCallback(async (text) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;

    setInput('');
    setStreaming(true);

    const userMsgId     = msgIdRef.current++;
    const placeholderId = msgIdRef.current++;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content, id: userMsgId }]);
    // Add assistant placeholder
    setMessages(prev => [...prev, { role: 'assistant', content: '', id: placeholderId, streaming: true }]);

    try {
        const controller = new AbortController();
        abortRef.current = controller;

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                'Accept': 'text/event-stream',
            },
            body: JSON.stringify({
                message:    content,
                session_id: activeId,
            }),
            signal: controller.signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const reader  = response.body.getReader();
        const decoder = new TextDecoder();
        let   buffer  = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const payload = JSON.parse(line.slice(6));

                if (payload.type === 'chunk') {
                    setMessages(prev => prev.map(m =>
                        m.id === placeholderId
                            ? { ...m, content: m.content + payload.text }
                            : m
                    ));
                }
                if (payload.type === 'done') {
                    setActiveId(payload.session_id);
                    setMessages(prev => prev.map(m =>
                        m.id === placeholderId ? { ...m, streaming: false } : m
                    ));
                }
                if (payload.type === 'error') throw new Error(payload.message);
            }
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            setMessages(prev => prev.map(m =>
                m.id === placeholderId  // ← fixed: was Date.now() + 1
                    ? { ...m, content: 'Sorry, something went wrong. Please try again.', streaming: false }
                    : m
            ));
        }
    } finally {
        setStreaming(false);
        abortRef.current = null;
    }
}, [input, streaming, activeId]);

    const handleStop = () => {
        abortRef.current?.abort();
        setStreaming(false);
        setMessages(prev => prev.map(m => ({ ...m, streaming: false })));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
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
                        activeSessionId={activeId}
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
                        {/* Toolbar */}
                        {hasMessages && user && (
                            <Box sx={{
                                display: 'flex', justifyContent: 'flex-end',
                                px: { xs: 2, md: 6 }, py: 1.5,
                                borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white',
                            }}>
                                <Button size="small" variant="outlined"
                                    startIcon={<BookmarkBorderIcon />}
                                    onClick={() => setSaveDialog(true)} sx={{ borderRadius: 2 }}>
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
                                {messages.map((msg) => (
                                    <Box key={msg.id ?? Math.random()} sx={{
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
                                            {msg.role === 'user' ? (
                                                <Typography variant="body2" sx={{ color: 'white', lineHeight: 1.7 }}>
                                                    {msg.content}
                                                </Typography>
                                            ) : (
                                                <>
                                                    {msg.content ? (
                                                        <MessageContent content={msg.content} />
                                                    ) : (
                                                        /* typing indicator */
                                                        <Box sx={{ display: 'flex', gap: 0.5, py: 0.5 }}>
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
                                                    )}
                                                    {msg.streaming && msg.content && (
                                                        <Box sx={{ width: 8, height: 16, bgcolor: 'primary.main',
                                                            display: 'inline-block', ml: 0.25, mb: '-3px',
                                                            animation: 'blink 0.8s step-end infinite',
                                                            '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
                                                        }} />
                                                    )}
                                                </>
                                            )}
                                        </Paper>
                                    </Box>
                                ))}
                                <div ref={bottomRef} />
                            </Box>
                        )}

                        {/* Input bar */}
                        <Box sx={{
                            px: { xs: 2, md: 6 }, py: 2.5,
                            borderTop: '1px solid', borderColor: 'divider', bgcolor: 'white',
                        }}>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', maxWidth: 800, mx: 'auto' }}>
                                <TextField fullWidth multiline maxRows={4}
                                    placeholder="Ask about any Nepal trek — routes, permits, seasons, gear…"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={streaming}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'grey.50' } }}
                                />
                                {streaming ? (
                                    <IconButton onClick={handleStop} sx={{
                                        width: 48, height: 48, flexShrink: 0,
                                        bgcolor: 'error.main', color: 'white', borderRadius: 2.5,
                                        '&:hover': { bgcolor: 'error.dark' },
                                    }}>
                                        <StopIcon fontSize="small" />
                                    </IconButton>
                                ) : (
                                    <IconButton onClick={() => handleSend()} disabled={!input.trim()} sx={{
                                        width: 48, height: 48, flexShrink: 0,
                                        bgcolor: input.trim() ? 'primary.main' : 'grey.200',
                                        color: input.trim() ? 'white' : 'text.disabled',
                                        borderRadius: 2.5, transition: 'all 0.2s',
                                        '&:hover': { bgcolor: input.trim() ? 'primary.dark' : 'grey.200' },
                                        '&:disabled': { bgcolor: 'grey.200', color: 'text.disabled' },
                                    }}>
                                        <SendIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                            <Typography variant="caption" color="text.disabled"
                                sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                                Press Enter to send · Shift+Enter for new line · Powered by Gemini + RAG
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <SaveTripDialog
                open={saveDialog}
                onClose={(saved) => {
                    setSaveDialog(false);
                    if (saved) { setSavedMsg('Trip saved!'); setSnackbar(true); }
                }}
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
