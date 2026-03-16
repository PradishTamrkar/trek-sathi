import { useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Chip,
    Tooltip, Alert, Snackbar, TextField, InputAdornment,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider,
} from '@mui/material';
import DeleteIcon  from '@mui/icons-material/Delete';
import SearchIcon  from '@mui/icons-material/Search';
import MailIcon    from '@mui/icons-material/Mail';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, usePage, Head } from '@inertiajs/react';

function ViewDialog({ open, onClose, contact }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" fontWeight={700}>{contact?.topic}</Typography>
                <Typography variant="caption" color="text.secondary">
                    From {contact?.contact_name} · {contact?.contact_email}
                </Typography>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 2.5 }}>
                <Typography variant="body2" sx={{ lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
                    {contact?.message}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} color="inherit">Close</Button>
            </DialogActions>
        </Dialog>
    );
}

function DeleteDialog({ open, onClose, contact }) {
    const { delete: destroy, processing } = useForm();
    const handleDelete = () => {
        destroy(route('admin.contacts.destroy', contact.id), {
            onSuccess: () => onClose(),
        });
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>Delete Message</Typography>
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 1 }}>
                    Delete message from <strong>{contact?.contact_name}</strong>?
                </Alert>
                <Typography variant="body2" color="text.secondary">This cannot be undone.</Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={onClose} color="inherit" disabled={processing}>Cancel</Button>
                <Button onClick={handleDelete} variant="contained" color="error" disabled={processing}>
                    {processing ? 'Deleting…' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function ContactsIndex({ contacts = [] }) {
    const { flash } = usePage().props;

    const [search,        setSearch]        = useState('');
    const [viewContact,   setViewContact]   = useState(null);
    const [deleteContact, setDeleteContact] = useState(null);
    const [snackbar,      setSnackbar]      = useState(!!flash?.success);

    const filtered = contacts.filter(c =>
        c.contact_name.toLowerCase().includes(search.toLowerCase())  ||
        c.contact_email.toLowerCase().includes(search.toLowerCase()) ||
        c.topic.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Contact Messages">
            <Head title="Contact Messages — TrekSathi Admin" />

            <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="success" onClose={() => setSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {flash?.success}
                </Alert>
            </Snackbar>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Contact Messages</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {contacts.length} message{contacts.length !== 1 ? 's' : ''} total
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
                <TextField placeholder="Search by name, email or topic…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    size="small" sx={{ width: 320 }}
                    InputProps={{ startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    )}}
                />
            </Box>

            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.50' }}>
                                {['Name', 'Email', 'Topic', 'Message', 'Received', 'Actions'].map(h => (
                                    <TableCell key={h} align={h === 'Actions' ? 'right' : 'left'}
                                        sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase',
                                            letterSpacing: '0.06em', color: 'text.secondary' }}>
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
                                            <MailIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {search ? 'No messages match your search.' : 'No contact messages yet.'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : filtered.map(c => (
                                <TableRow key={c.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {!c.is_read && (
                                                <Box sx={{ width: 7, height: 7, borderRadius: '50%',
                                                    bgcolor: 'primary.main', flexShrink: 0 }} />
                                            )}
                                            <Typography variant="body2" fontWeight={c.is_read ? 400 : 700}>
                                                {c.contact_name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">{c.contact_email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={c.topic} size="small"
                                            sx={{ fontSize: '0.68rem', height: 20,
                                                bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 500 }} />
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 220 }}>
                                        <Tooltip title="Click to read full message">
                                            <Typography variant="body2" color="text.secondary" noWrap
                                                onClick={() => setViewContact(c)}
                                                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                                                {c.message}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(c.created_at).toLocaleDateString('en-US',
                                                { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="View">
                                            <IconButton size="small" onClick={() => setViewContact(c)}
                                                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                                                <MailIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" onClick={() => setDeleteContact(c)}
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

            <ViewDialog open={Boolean(viewContact)} onClose={() => setViewContact(null)} contact={viewContact} />
            <DeleteDialog open={Boolean(deleteContact)} onClose={() => setDeleteContact(null)} contact={deleteContact} />
        </AdminLayout>
    );
}
