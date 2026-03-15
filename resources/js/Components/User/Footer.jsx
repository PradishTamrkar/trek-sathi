import { Box, Typography, Divider } from '@mui/material';
import TerrainIcon from '@mui/icons-material/Terrain';

export default function Footer() {
    const year = new Date().getFullYear();

    const sections = [
        {
            title: 'Explore',
            links: ['Trekking Routes', 'Regions', 'Permits', 'Tea Houses'],
        },
        {
            title: 'Plan',
            links: ['AI Trip Planner', 'Plan Yourself', 'Saved Trips', 'Community Reports'],
        },
        {
            title: 'Company',
            links: ['About TrekSathi', 'Contact', 'Privacy Policy', 'Terms of Use'],
        },
    ];

    return (
        <Box component="footer" sx={{
            bgcolor: '#0d1f14',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            pt: 6, pb: 3, px: { xs: 3, md: 8 },
        }}>
            {/* Top row */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 5,
                mb: 5,
            }}>
                {/* Brand */}
                <Box sx={{ flex: 1.2, minWidth: 200 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <TerrainIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                        <Typography variant="h6" fontWeight={900}
                            sx={{ color: 'white', fontFamily: 'Georgia, serif' }}>
                            Trek<Box component="span" sx={{ color: 'secondary.main' }}>Sathi</Box>
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: 240 }}>
                        Your AI-powered Nepal trekking companion. Plan smarter, trek better.
                    </Typography>
                </Box>

                {/* Link sections */}
                {sections.map(section => (
                    <Box key={section.title} sx={{ flex: 1, minWidth: 130 }}>
                        <Typography variant="caption" fontWeight={700}
                            sx={{ color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1.5 }}>
                            {section.title}
                        </Typography>
                        {section.links.map(link => (
                            <Typography key={link} variant="body2"
                                sx={{
                                    color: 'rgba(255,255,255,0.5)',
                                    display: 'block', mb: 0.75,
                                    cursor: 'pointer',
                                    transition: 'color 0.2s',
                                    '&:hover': { color: 'rgba(255,255,255,0.85)' },
                                }}>
                                {link}
                            </Typography>
                        ))}
                    </Box>
                ))}
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />

            {/* Bottom row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)' }}>
                    © {year} TrekSathi. Built for Nepal trekkers.
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)' }}>
                    Made with ❤️ in Kathmandu
                </Typography>
            </Box>
        </Box>
    );
}
