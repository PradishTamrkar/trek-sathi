import { useState } from 'react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography, IconButton, Chip, Tooltip, Alert, Paper,
    Snackbar, InputAdornment, Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, usePage, Head } from '@inertiajs/react';

// Avatar colour derived from user's name so it's consistent
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 45%, 45%)`;
}

function UserAvatar({ name }) {
    const initials = name
        ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : '?';
    return (
        <Avatar sx={{ width: 30, height: 30, bgcolor: stringToColor(name ?? ''), fontSize: '0.75rem', fontWeight: 700 }}>
            {initials}
        </Avatar>
    );
}

//Delete confirm dialog
function DeleteDialog({ open, onClose, user }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('admin.users.destroy', user.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>Delete User</Typography>
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 1 }}>
                    Deleting <strong>{user?.name}</strong> will also remove all their saved trips,
                    chat history, and community submissions.
                </Alert>
                <Typography variant="body2" color="text.secondary">
                    This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={onClose} color="inherit" disabled={processing}>Cancel</Button>
                <Button onClick={handleDelete} variant="contained" color="error" disabled={processing}>
                    {processing ? 'Deleting…' : 'Delete User'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

//Main page
export default function UsersIndex({ users }) {
    const { flash } = usePage().props;

    const [search,      setSearch]      = useState('');
    const [deleteUser,  setDeleteUser]  = useState(null);
    const [snackbar,    setSnackbar]    = useState(!!flash?.success);
    const [errorSnackbar, setErrorSnackbar] = useState(!!flash?.failed);

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Users">
            <Head title="Users — TrekSathi Admin" />

            <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="success" onClose={() => setSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {flash?.success}
                </Alert>
            </Snackbar>

            <Snackbar open={errorSnackbar} autoHideDuration={5000} onClose={() => setErrorSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="error" onClose={() => setErrorSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {flash?.failed}
                </Alert>
            </Snackbar>

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Users</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {users.length} registered user{users.length !== 1 ? 's' : ''}
                    </Typography>
                </Box>
            </Box>

            {/* Search */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    size="small"
                    sx={{ width: 300 }}
                    InputProps={{ startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    )}}
                />
            </Box>

            {/* Table */}
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.50' }}>
                                {['User', 'Email', 'Saved Trips', 'Submissions', 'Joined', 'Actions'].map(h => (
                                    <TableCell key={h} align={h === 'Actions' ? 'right' : 'left'}
                                        sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.secondary' }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Box sx={{ py: 6, textAlign: 'center' }}>
                                            <PeopleIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {search ? 'No users match your search.' : 'No users registered yet.'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : filtered.map(u => (
                                <TableRow key={u.id} hover sx={{ '&:last-child td': { border: 0 } }}>

                                    {/* User name + avatar */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <UserAvatar name={u.name} />
                                            <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                                        </Box>
                                    </TableCell>

                                    {/* Email */}
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                                    </TableCell>

                                    {/* Saved trips count */}
                                    <TableCell>
                                        <Chip
                                            label={u.saved_trips_count}
                                            size="small"
                                            sx={{ fontSize: '0.7rem', height: 20, fontWeight: 600,
                                                bgcolor: u.saved_trips_count > 0 ? '#e3f2fd' : '#f5f5f5',
                                                color:   u.saved_trips_count > 0 ? '#1565c0' : '#9e9e9e',
                                            }}
                                        />
                                    </TableCell>

                                    {/* Submissions count */}
                                    <TableCell>
                                        <Chip
                                            label={u.community_submission_count}
                                            size="small"
                                            sx={{ fontSize: '0.7rem', height: 20, fontWeight: 600,
                                                bgcolor: u.community_submission_count > 0 ? '#e8f5e9' : '#f5f5f5',
                                                color:   u.community_submission_count > 0 ? '#2e7d32' : '#9e9e9e',
                                            }}
                                        />
                                    </TableCell>

                                    {/* Joined date */}
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(u.created_at).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </Typography>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell align="right">
                                        <Tooltip title="Delete user">
                                            <IconButton size="small" onClick={() => setDeleteUser(u)}
                                                sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <DeleteDialog
                open={Boolean(deleteUser)}
                onClose={() => setDeleteUser(null)}
                user={deleteUser}
            />
        </AdminLayout>
    );
}
