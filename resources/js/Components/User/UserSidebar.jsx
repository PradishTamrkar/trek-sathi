import { router } from "@inertiajs/react";
import {
    Box, Button, Typography, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon  from '@mui/icons-material/History';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export const SIDEBAR_W = 260;

export default function UserSidebar({
    open,
    chatSessions = [],
    savedTrips = [],
    activePage = 'home',
    activeSessionId = null,
}){
    const handlePrimary = () => {
        if(activePage === 'chat'){
            router.visit('/chat');
        }else {
            router.visit('/chat');
        }
    };

    return (
        <Box sx={{
            width: open ? SIDEBAR_W : 0, flexShrink: 0, overflow: 'hidden',
            transition: 'width 0.25s ease', bgcolor: '#1a2e1f',
            position: 'fixed', top: 64, bottom: 0, left: 0, zIndex: 10,
        }}>
            <Box sx={{ width: SIDEBAR_W, height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

                {/* Primary button */}
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={activePage === 'chat' ? <AddIcon /> : <AutoAwesomeIcon />}
                        onClick={handlePrimary}
                        sx={{ py: 1, justifyContent: 'flex-start', px: 2 }}
                    >
                        {activePage === 'chat' ? 'New Chat' : 'Plan with AI'}
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
                        ? <Typography variant="caption"
                            sx={{ color: 'rgba(255,255,255,0.22)', pl: 0.5, display: 'block', mb: 2 }}>
                            No chats yet
                          </Typography>
                        : chatSessions.map(s => {
                            const isActive = s.id?.toString() === activeSessionId?.toString();
                            return (
                                <Box key={s.id ?? s.session_id}
                                    onClick={() => router.visit(`/chat/${s.id ?? s.session_id}`)}
                                    sx={{
                                        px: 1.5, py: 0.9, borderRadius: 1.5, mb: 0.5, cursor: 'pointer',
                                        bgcolor: isActive ? 'rgba(76,175,80,0.15)' : 'transparent',
                                        borderLeft: isActive ? '2px solid #4caf50' : '2px solid transparent',
                                        '&:hover': { bgcolor: isActive ? 'rgba(76,175,80,0.18)' : 'rgba(255,255,255,0.06)' },
                                    }}>
                                    <Typography variant="body2" noWrap
                                        sx={{ color: isActive ? 'white' : 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }}>
                                        {s.title ?? s.first_message ?? 'Untitled chat'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)' }}>
                                        {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </Typography>
                                </Box>
                            );
                        })
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
                            <Box key={trip.id}
                                onClick={() => router.visit(`/trips/${trip.id}`)}
                                sx={{ px: 1.5, py: 0.9, borderRadius: 1.5, mb: 0.5, cursor: 'pointer',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}>
                                <Typography variant="body2" noWrap
                                    sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }}>
                                    {trip.trip_title}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)' }}>
                                    {trip.trekkingRoute?.trekking_route_name ?? trip.route_name ?? ''}
                                </Typography>
                            </Box>
                        ))
                    }
                </Box>
            </Box>
        </Box>
    );
}
