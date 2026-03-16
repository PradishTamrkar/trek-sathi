import { Head, router } from '@inertiajs/react';
import { Box, Card, CardContent, Typography, Grid, Badge } from '@mui/material';
import MapIcon          from '@mui/icons-material/Map';
import AltRouteIcon     from '@mui/icons-material/AltRoute';
import PeopleIcon       from '@mui/icons-material/People';
import ArticleIcon      from '@mui/icons-material/Article';
import HouseIcon        from '@mui/icons-material/House';
import MailIcon         from '@mui/icons-material/Mail';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AdminLayout      from '../../Layouts/AdminLayout';

function StatCard({ label, value, icon, color, badge }) {
    const palette = {
        green:  { bg: '#e8f5e9', icon: '#2e7d32' },
        blue:   { bg: '#e3f2fd', icon: '#1565c0' },
        amber:  { bg: '#fff8e1', icon: '#e65100' },
        red:    { bg: '#fce4ec', icon: '#c62828' },
        teal:   { bg: '#e0f2f1', icon: '#00695c' },
        purple: { bg: '#f3e5f5', icon: '#6a1b9a' },
    }[color] ?? { bg: '#f5f5f5', icon: '#555' };

    return (
        <Card variant="outlined" sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}
                            sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            {label}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="h3" fontWeight={700} sx={{ lineHeight: 1 }}>
                                {value ?? '—'}
                            </Typography>
                            {badge > 0 && (
                                <Box sx={{ bgcolor: '#ef5350', color: 'white', borderRadius: '10px',
                                    px: 0.75, fontSize: '0.65rem', fontWeight: 700, lineHeight: '18px' }}>
                                    {badge} new
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: palette.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.icon }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

function ActionCard({ emoji, label, desc, href, badge }) {
    return (
        <Card variant="outlined" component="a" href={href}
            sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200',
                textDecoration: 'none', display: 'block', transition: 'all 0.15s', position: 'relative',
                '&:hover': { borderColor: 'primary.main',
                    boxShadow: '0 4px 20px rgba(46,125,50,0.1)', transform: 'translateY(-2px)' } }}>
            {badge > 0 && (
                <Box sx={{ position: 'absolute', top: 10, right: 10,
                    bgcolor: '#ef5350', color: 'white', borderRadius: '10px',
                    px: 0.75, fontSize: '0.65rem', fontWeight: 700, lineHeight: '18px' }}>
                    {badge} new
                </Box>
            )}
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Typography fontSize="1.75rem" sx={{ mb: 1.5 }}>{emoji}</Typography>
                <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ mb: 0.5 }}>{label}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>{desc}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
                    <Typography variant="caption" fontWeight={600}>Open</Typography>
                    <ArrowForwardIcon sx={{ fontSize: 14 }} />
                </Box>
            </CardContent>
        </Card>
    );
}

export default function Dashboard({ stats = {} }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard — TrekSathi Admin" />

            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={700}>Overview</Typography>
                <Typography variant="body2" color="text.secondary">
                    Here's what's happening with TrekSathi today.
                </Typography>
            </Box>

            {/* 6 stat cards */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={2}>
                    <StatCard label="Trekking Routes"     value={stats?.total_routes}        icon={<AltRouteIcon />} color="green" />
                </Grid>
                <Grid item xs={12} sm={6} lg={2}>
                    <StatCard label="Regions"             value={stats?.total_regions}       icon={<MapIcon />}      color="blue"  />
                </Grid>
                <Grid item xs={12} sm={6} lg={2}>
                    <StatCard label="Tea Houses"          value={stats?.total_tea_houses}    icon={<HouseIcon />}    color="teal"  />
                </Grid>
                <Grid item xs={12} sm={6} lg={2}>
                    <StatCard label="Total Users"         value={stats?.total_users}         icon={<PeopleIcon />}   color="amber" />
                </Grid>
                <Grid item xs={12} sm={6} lg={2}>
                    <StatCard label="Pending Submissions" value={stats?.pending_submissions} icon={<ArticleIcon />}  color="red"   />
                </Grid>
                <Grid item xs={12} sm={6} lg={2}>
                    <StatCard label="Messages"            value={stats?.unread_contacts}     icon={<MailIcon />}     color="purple"
                        badge={stats?.unread_contacts} />
                </Grid>
            </Grid>

            {/* Quick actions */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Quick Actions</Typography>
            <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={4}>
                    <ActionCard emoji="🗺️" label="Manage Regions"     desc="Add or edit trekking regions and best seasons."  href="/admin/regions" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ActionCard emoji="🏔️" label="Manage Routes"      desc="Create, update, or archive trekking routes."     href="/admin/trekkingRoutes" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ActionCard emoji="🏠" label="Manage Tea Houses"  desc="Add tea houses — AI uses them for suggestions."  href="/admin/teaHouses" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ActionCard emoji="📋" label="Review Submissions" desc="Approve or reject community trail reports."       href="/admin/submissions" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ActionCard emoji="👥" label="Manage Users"       desc="View and manage registered users."               href="/admin/users" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ActionCard emoji="✉️" label="Messages"           desc="Read and reply to user contact messages."        href="/admin/contacts"
                        badge={stats?.unread_contacts} />
                </Grid>
            </Grid>
        </AdminLayout>
    );
}
