import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton, Avatar, Divider, Tooltip, Menu, MenuItem, Chip, } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const DRAWER_FULL = 240;
const DRAWER_MINI = 64;

//Navbar items
const navItems = [
    {
        label: 'Dashboard',
        icon:<DashboardIcon />,
        routeName:'admin.dashboard',
        href:'/admin/dashboard'
    },
    {
        label: 'Regions',
        icon:<MapIcon/>,
        routeName:'admin.regions',
        href:'#'
    },
    {
        label: 'Trekking Routes',
        icon: <AltRouteIcon/>,
        routeName:'admin.trekkingRoutes',
        href: '#',
    },
    {
        label: 'Submissions',
        icon: <ArticleIcon/>,
        routeName: 'admin.submissions',
        href: '#',
    },
    {
        label: 'Users',
        icon:<PeopleIcon/>,
        routeName: 'admin.users',
        href: '#',
    },
];

//Main Layout
export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const [collapsed, setCollapsed] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const drawerWidth = collapsed ? DRAWER_MINI : DRAWER_FULL

    const isActive = (routeName)=>{
        try {return route().current(routeName)}
        catch {return false}
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>

            {/* ── Sidebar ── */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    transition: 'width 0.25s ease',
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        transition: 'width 0.25s ease',
                        overflowX: 'hidden',
                        bgcolor: '#1a2e1f',
                        border: 'none',
                        boxSizing: 'border-box',
                    },
                }}
            >
                {/* Logo */}
                <Toolbar sx={{
                    px: collapsed ? 1 : 2,
                    minHeight: '64px !important',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                    {!collapsed && (
                        <Typography variant="h6" fontWeight={800} color="white">
                            Trek<Box component="span" sx={{ color: 'secondary.main' }}>Sathi</Box>
                            <Chip label="Admin" size="small" sx={{ ml: 1, fontSize: '0.6rem', height: 18, bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }} />
                        </Typography>
                    )}
                    {collapsed && (
                        <Typography fontWeight={900} sx={{ color: 'secondary.main', fontSize: '1.3rem', mx: 'auto' }}>T</Typography>
                    )}
                    <IconButton onClick={() => setCollapsed(c => !c)} size="small" sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: 'white' } }}>
                        {collapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
                    </IconButton>
                </Toolbar>

                {/* Nav */}
                <List sx={{ px: 1, py: 1.5, flex: 1 }}>
                    {navItems.map(item => {
                        const active = isActive(item.routeName);
                        return (
                            <Tooltip key={item.routeName} title={collapsed ? item.label : ''} placement="right">
                                <ListItem disablePadding sx={{ mb: 0.5 }}>
                                    <ListItemButton
                                        component={Link}
                                        href={item.href}
                                        sx={{
                                            borderRadius: 2,
                                            py: 1, px: 1.5,
                                            justifyContent: collapsed ? 'center' : 'flex-start',
                                            bgcolor: active ? 'rgba(76,175,80,0.15)' : 'transparent',
                                            borderLeft: active ? '3px solid #4caf50' : '3px solid transparent',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: active ? '#4caf50' : 'rgba(255,255,255,0.4)' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        {!collapsed && (
                                            <ListItemText
                                                primary={item.label}
                                                primaryTypographyProps={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: active ? 600 : 400,
                                                    color: active ? 'white' : 'rgba(255,255,255,0.55)',
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            </Tooltip>
                        );
                    })}
                </List>

                {/* User strip */}
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                <Box sx={{ p: 1.5 }}>
                    <ListItemButton
                        onClick={e => setAnchorEl(e.currentTarget)}
                        sx={{ borderRadius: 2, px: 1, justifyContent: collapsed ? 'center' : 'flex-start', '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}
                    >
                        <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.dark', fontSize: '0.8rem', fontWeight: 700, mr: collapsed ? 0 : 1.5 }}>
                            {auth?.user?.name?.[0]?.toUpperCase() ?? 'A'}
                        </Avatar>
                        {!collapsed && (
                            <Box sx={{ overflow: 'hidden' }}>
                                <Typography variant="caption" fontWeight={600} color="white" display="block" noWrap>{auth?.user?.name}</Typography>
                                <Typography variant="caption" color="rgba(255,255,255,0.4)" display="block" noWrap>{auth?.user?.email}</Typography>
                            </Box>
                        )}
                    </ListItemButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        PaperProps={{ sx: { minWidth: 190, borderRadius: 2 } }}
                    >
                        <MenuItem disabled sx={{ opacity: '1 !important' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">Signed in as</Typography>
                                <Typography variant="body2" fontWeight={600} noWrap>{auth?.user?.email}</Typography>
                            </Box>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => router.post(route('logout'))} sx={{ color: 'error.main', gap: 1 }}>
                            <LogoutIcon fontSize="small" /> Sign Out
                        </MenuItem>
                    </Menu>
                </Box>
            </Drawer>

            {/* ── Main area ── */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                {/* AppBar */}
                <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
                    <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important' }}>
                        <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Notifications">
                                <IconButton size="small"><NotificationsNoneIcon fontSize="small" /></IconButton>
                            </Tooltip>
                            <Tooltip title="View site">
                                <IconButton size="small" component="a" href="/" target="_blank"><OpenInNewIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Content */}
                <Box component="main" sx={{ flex: 1, p: 3 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    )
}
