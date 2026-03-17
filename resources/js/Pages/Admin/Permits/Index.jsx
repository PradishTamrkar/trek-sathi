import { useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Tooltip,
    Alert, Snackbar, Button, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, Divider, Chip,
} from '@mui/material';
import AddIcon       from '@mui/icons-material/Add';
import EditIcon      from '@mui/icons-material/Edit';
import DeleteIcon    from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArticleIcon   from '@mui/icons-material/Article';
import AdminLayout   from '../../../Layouts/AdminLayout';
import { useForm, usePage, Head, router } from '@inertiajs/react';

// ── Create / Edit dialog ──────────────────────────────────────────────────────
function PermitDialog({ open, onClose, permit = null, routeId }) {
    const isEdit = Boolean(permit);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        permit_name:  permit?.permit_name  ?? '',
        price_in_usd: permit?.price_in_usd ?? '',
        price_in_npr: permit?.price_in_npr ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.trekkingRoutes.permits.update', { trekkingRoute: routeId, permit: permit.id }), {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post(route('admin.trekkingRoutes.permits.store', { trekkingRoute: routeId }), {
                onSuccess: () => { reset(); onClose(); },
            });
        }
    };

    const handleClose = () => { reset(); onClose(); };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                    {isEdit ? 'Edit Permit' : 'Add Permit'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Leave prices empty if not applicable
                </Typography>
            </DialogTitle>
            <Divider />
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
                    <TextField
                        label="Permit Name"
                        value={data.permit_name}
                        onChange={e => setData('permit_name', e.target.value)}
                        error={!!errors.permit_name} helperText={errors.permit_name}
                        required autoFocus
                        placeholder="e.g. Sagarmatha National Park Entry"
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Price (USD)" type="number"
                            value={data.price_in_usd}
                            onChange={e => setData('price_in_usd', e.target.value)}
                            error={!!errors.price_in_usd} helperText={errors.price_in_usd}
                            inputProps={{ min: 0, step: 0.01 }}
                            placeholder="0.00"
                        />
                        <TextField
                            label="Price (NPR)" type="number"
                            value={data.price_in_npr}
                            onChange={e => setData('price_in_npr', e.target.value)}
                            error={!!errors.price_in_npr} helperText={errors.price_in_npr}
                            inputProps={{ min: 0, step: 0.01 }}
                            placeholder="0.00"
                        />
                    </Box>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button onClick={handleClose} color="inherit" disabled={processing}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={processing}>
                        {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Permit'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

// ── Delete dialog ─────────────────────────────────────────────────────────────
function DeleteDialog({ open, onClose, permit, routeId }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('admin.trekkingRoutes.permits.destroy', { trekkingRoute: routeId, permit: permit.id }), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>Delete Permit</Typography>
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 1 }}>
                    Delete <strong>{permit?.permit_name}</strong>?
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

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PermitsIndex({ trekkingRoute, permits = [] }) {
    const { flash } = usePage().props;

    const [createOpen,  setCreateOpen]  = useState(false);
    const [editPermit,  setEditPermit]  = useState(null);
    const [deletePermit,setDeletePermit]= useState(null);
    const [snackbar,    setSnackbar]    = useState(!!flash?.success);
    const [errSnackbar, setErrSnackbar] = useState(!!flash?.failed);

    const totalUsd = permits.reduce((sum, p) => sum + (parseFloat(p.price_in_usd) || 0), 0);
    const totalNpr = permits.reduce((sum, p) => sum + (parseFloat(p.price_in_npr) || 0), 0);

    return (
        <AdminLayout title={`Permits — ${trekkingRoute?.trekking_route_name}`}>
            <Head title={`Permits — ${trekkingRoute?.trekking_route_name}`} />

            <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="success" onClose={() => setSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {flash?.success}
                </Alert>
            </Snackbar>
            <Snackbar open={errSnackbar} autoHideDuration={5000} onClose={() => setErrSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="error" onClose={() => setErrSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {flash?.failed}
                </Alert>
            </Snackbar>

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Button startIcon={<ArrowBackIcon />} size="small"
                        onClick={() => router.visit('/admin/trekkingRoutes')}
                        sx={{ mb: 1, color: 'text.secondary', pl: 0 }}>
                        Back to Routes
                    </Button>
                    <Typography variant="h5" fontWeight={700}>
                        {trekkingRoute?.trekking_route_name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Required Permits</Typography>
                        <Chip label={`${permits.length} permits`} size="small"
                            sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#fff3e0', color: '#e65100', fontWeight: 600 }} />
                        {totalUsd > 0 && (
                            <Chip label={`Total $${totalUsd.toFixed(0)} USD`} size="small"
                                sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
                        )}
                    </Box>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
                    Add Permit
                </Button>
            </Box>

            {/* Table */}
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.50' }}>
                                {['Permit Name', 'Price (USD)', 'Price (NPR)', 'Actions'].map(h => (
                                    <TableCell key={h} align={h === 'Actions' ? 'right' : 'left'}
                                        sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase',
                                            letterSpacing: '0.06em', color: 'text.secondary' }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {permits.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Box sx={{ py: 6, textAlign: 'center' }}>
                                            <ArticleIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                No permits added yet.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : permits.map(p => (
                                <TableRow key={p.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{p.permit_name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700} color="primary.main">
                                            {p.price_in_usd ? `$${Number(p.price_in_usd).toFixed(2)}` : '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {p.price_in_npr ? `NPR ${Number(p.price_in_npr).toLocaleString()}` : '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => setEditPermit(p)}
                                                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" onClick={() => setDeletePermit(p)}
                                                sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {/* Totals row */}
                            {permits.length > 1 && (
                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>Total</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700} color="primary.main">
                                            ${totalUsd.toFixed(2)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700} color="text.secondary">
                                            NPR {totalNpr.toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <PermitDialog open={createOpen} onClose={() => setCreateOpen(false)} routeId={trekkingRoute?.id} />
            <PermitDialog open={Boolean(editPermit)} onClose={() => setEditPermit(null)} permit={editPermit} routeId={trekkingRoute?.id} />
            <DeleteDialog open={Boolean(deletePermit)} onClose={() => setDeletePermit(null)} permit={deletePermit} routeId={trekkingRoute?.id} />
        </AdminLayout>
    );
}
