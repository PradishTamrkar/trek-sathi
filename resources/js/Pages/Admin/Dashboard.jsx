import { Head } from '@inertiajs/react';
import { Box, Card, CardContent, Typography, Grid, Button } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AdminLayout from '../../Layouts/AdminLayout';

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
    const palette = {
        green:  { bg: '#e8f5e9', icon: '#2e7d32' },
        blue:   { bg: '#e3f2fd', icon: '#1565c0' },
        amber:  { bg: '#fff8e1', icon: '#e65100' },
        red:    { bg: '#fce4ec', icon: '#c62828' },
    }[color] ?? { bg: '#f5f5f5', icon: '#555' };

    return (
        <Card variant="outlined" sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            {label}
                        </Typography>
                        <Typography variant="h3" fontWeight={700} sx={{ mt: 0.5, lineHeight: 1 }}>
                            {value ?? '—'}
                        </Typography>
                    </Box>
                    <Box sx={{
                        width: 44, height: 44, borderRadius: 2.5,
                        bgcolor: palette.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: palette.icon,
                    }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

// ── Quick action card ─────────────────────────────────────────────────────────
function ActionCard({ emoji, label, desc, href }) {
    return (
        <Card
            variant="outlined"
            component="a"
            href={href}
            sx={{
                borderRadius: 3, border: '1px solid', borderColor: 'grey.200',
                textDecoration: 'none', display: 'block',
                transition: 'all 0.15s',
                '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 20px rgba(46,125,50,0.1)', transform: 'translateY(-2px)' },
            }}
        >
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Typography fontSize="1.75rem" sx={{ mb: 1.5 }}>{emoji}</Typography>
                <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ mb: 0.5 }}>
                    {label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {desc}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
                    <Typography variant="caption" fontWeight={600}>Open</Typography>
                    <ArrowForwardIcon sx={{ fontSize: 14 }} />
                </Box>
            </CardContent>
        </Card>
    );
}

// ── Dashboard page ────────────────────────────────────────────────────────────
export default function Dashboard({ stats }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard — TrekSathi Admin" />

            {/* Page heading */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={700}>Overview</Typography>
                <Typography variant="body2" color="text.secondary">
                    Here's what's happening with TrekSathi today.
                </Typography>
            </Box>

            {/* Stats */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} xl={3}>
                    <StatCard label="Trekking Routes"    value={stats?.total_routes}       icon={<AltRouteIcon />} color="green" />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                    <StatCard label="Regions"            value={stats?.total_regions}      icon={<MapIcon />}      color="blue"  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                    <StatCard label="Total Users"        value={stats?.total_users}        icon={<PeopleIcon />}   color="amber" />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                    <StatCard label="Pending Submissions" value={stats?.pending_submissions} icon={<ArticleIcon />} color="red"  />
                </Grid>
            </Grid>

            {/* Quick actions */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Quick Actions</Typography>
            <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={4}>
                    <ActionCard emoji="🗺️" label="Manage Regions"      desc="Add or edit trekking regions and best seasons."     href="#" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ActionCard emoji="🏔️" label="Manage Routes"       desc="Create, update, or archive trekking routes."        href="#" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ActionCard emoji="📋" label="Review Submissions"  desc="Approve or reject community trail reports."         href="#" />
                </Grid>
            </Grid>
        </AdminLayout>
    );
}
