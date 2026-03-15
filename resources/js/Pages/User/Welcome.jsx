import { Head } from '@inertiajs/react';
import { Box, Button, Typography, Container } from '@mui/material';
import TerrainIcon from '@mui/icons-material/Terrain';
import Navbar from '../../Components/User/Navbar';
import Footer from '../../Components/User/Footer';

export default function Welcome() {
    return (
        <>
            <Head title="TrekSathi — Your Nepal Trekking Companion" />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar user={null} />

                {/*Hero*/}
                <Box sx={{
                    flex: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(160deg, #0d1f14 0%, #1a3a2f 55%, #2d5a3d 100%)',
                    minHeight: '100vh',
                }}>
                    {/* Stars */}
                    <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `
                        radial-gradient(1px 1px at 12% 15%, rgba(255,255,255,.9) 0%, transparent 100%),
                        radial-gradient(1.5px 1.5px at 35% 8%,  rgba(255,255,255,1)  0%, transparent 100%),
                        radial-gradient(1px 1px at 60% 12%, rgba(255,255,255,.7) 0%, transparent 100%),
                        radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,.8) 0%, transparent 100%),
                        radial-gradient(1px 1px at 22% 55%, rgba(255,255,255,.3) 0%, transparent 100%),
                        radial-gradient(1px 1px at 50% 35%, rgba(255,255,255,.4) 0%, transparent 100%),
                        radial-gradient(1.5px 1.5px at 75% 30%, rgba(255,255,255,.5) 0%, transparent 100%)`,
                    }} />

                    {/* Mountain silhouette */}
                    <Box component="svg" viewBox="0 0 800 320" fill="none"
                        sx={{ position: 'absolute', bottom: 0, width: '100%', minWidth: 600 }}>
                        <path d="M0 320L0 220L100 165L180 200L280 110L380 160L470 60L560 120L640 80L720 115L800 90L800 320Z"
                            fill="#1a3a2a" opacity=".45"/>
                        <path d="M0 320L0 240L80 195L160 225L240 175L320 205L400 140L480 175L560 145L640 170L720 150L800 165L800 320Z"
                            fill="#163020" opacity=".6"/>
                        <path d="M150 320L400 50L650 320Z" fill="#2d5a3d" opacity=".5"/>
                        <path d="M100 320L400 30L700 320Z" fill="#1e3a2f" opacity=".7"/>
                        {/* Snow cap */}
                        <path d="M400 30L422 72L438 64L454 85L434 94L414 80L396 93L376 84L392 63L406 72Z"
                            fill="white" opacity=".9"/>
                    </Box>

                    <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', pt: 12, pb: 8 }}>
                        {/* Badge */}
                        <Box sx={{
                            display: 'inline-flex', alignItems: 'center', gap: 1,
                            bgcolor: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '100px', px: 2, py: 0.6, mb: 4,
                        }}>
                            <TerrainIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em' }}>
                                AI-Powered Nepal Trekking Companion
                            </Typography>
                        </Box>

                        <Typography variant="h1" sx={{
                            fontSize: { xs: '2.6rem', md: '4.4rem' },
                            fontFamily: 'Georgia, serif',
                            color: 'white', lineHeight: 1.08, mb: 2.5,
                        }}>
                            Explore Nepal's<br />
                            <Box component="span" sx={{ color: 'secondary.main' }}>Greatest Treks</Box>
                        </Typography>

                        <Typography variant="body1" sx={{
                            color: 'rgba(255,255,255,0.5)',
                            maxWidth: 500, mx: 'auto', mb: 5, lineHeight: 1.85,
                        }}>
                            Plan your perfect adventure with AI guidance, real‑time trail conditions,
                            permit info, and community insights — all in one place.
                        </Typography>

                        {/* Feature pills */}
                        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
                            {['🤖 AI Chat', '🗺️ 50+ Routes', '📋 Permit Info', '🏠 Tea Houses', '👥 Community'].map(f => (
                                <Box key={f} sx={{
                                    bgcolor: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '100px', px: 2, py: 0.6,
                                }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>{f}</Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Stats row */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 3, md: 6 }, flexWrap: 'wrap' }}>
                            {[['50+', 'Trekking Routes'], ['15+', 'Regions'], ['500+', 'Tea Houses'], ['24/7', 'AI Support']].map(([val, label]) => (
                                <Box key={label} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight={800} sx={{ color: 'secondary.main', lineHeight: 1 }}>{val}</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{label}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Container>
                </Box>

                <Footer />
            </Box>
        </>
    );
}
