import { useState } from 'react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, IconButton, Chip, Tooltip, Alert, Paper,
    Snackbar, InputAdornment, TextField, Tab, Tabs,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, usePage, Head } from '@inertiajs/react';

//Trail condition chip
const TRIAL_MAP = {
    good:    { label: 'Good',    bg: '#e8f5e9', color: '#2e7d32' },
    damaged: { label: 'Damaged', bg: '#fff8e1', color: '#e65100' },
    closed:  { label: 'Closed',  bg: '#fce4ec', color: '#c62828' },
};

function TrailChip({ condition }) {
    if (!condition) return <Typography variant="caption" color="text.disabled">—</Typography>;
    const cfg = TRAIL_MAP[condition] ?? { label: condition, bg: '#f5f5f5', color: '#555' };
    return (
        <Chip label={cfg.label} size="small"
            sx={{ fontSize: '0.7rem', height: 20, fontWeight: 600, bgcolor: cfg.bg, color: cfg.color }} />
    );
}

//Status chip
const STATUS_MAP = {
    pending:  { label: 'Pending',  bg: '#fff8e1', color: '#e65100' },
    approved: { label: 'Approved', bg: '#e8f5e9', color: '#2e7d32' },
    rejected: { label: 'Rejected', bg: '#fce4ec', color: '#c62828' },
};

function StatusChip({ status }) {
    const cfg = STATUS_MAP[status] ?? { label: status, bg: '#f5f5f5', color: '#555' };
    return (
        <Chip label={cfg.label} size="small"
            sx={{ fontSize: '0.7rem', height: 20, fontWeight: 600, bgcolor: cfg.bg, color: cfg.color }} />
    );
}

//Delete confirm dialog
function DeleteDialog({ open, onClose, submission }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('admin.submissions.destroy', submission.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>Delete Submission</Typography>
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 1 }}>
                    You are about to delete a submission by <strong>{submission?.user?.name ?? 'Unknown'}</strong>.
                </Alert>
                <Typography variant="body2" color="text.secondary">This action cannot be undone.</Typography>
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

//Experience text expand dialog
function ExperienceDialog({ open, onClose, submission }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>Submission Details</Typography>
                <Typography variant="caption" color="text.secondary">
                    By {submission?.user?.name ?? '—'} · {submission?.trekking_route?.trekking_route_name ?? '—'}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TrailChip condition={submission?.trail_condition} />
                    <StatusChip status={submission?.status} />
                </Box>
                <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {submission?.experience_text}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} color="inherit">Close</Button>
            </DialogActions>
        </Dialog>
    );
}

//Main page
export default function SubmissionsIndex({ submissions }) {
    const { flash } = usePage().props;
    const { put, processing } = useForm();

    const [search,           setSearch]          = useState('');
    const [statusFilter,     setStatusFilter]     = useState('all');
    const [deleteSubmission, setDeleteSubmission] = useState(null);
    const [viewSubmission,   setViewSubmission]   = useState(null);
    const [snackbar,         setSnackbar]         = useState(!!flash?.success);
    const [errorSnackbar,    setErrorSnackbar]    = useState(!!flash?.failed);

    // Update status inline (approve / reject)
    const handleStatusChange = (submission, newStatus) => {
        put(route('admin.submissions.update', submission.id), {
            data: { status: newStatus },
            preserveScroll: true,
            onSuccess: () => setSnackbar(true),
        });
    };

    const STATUS_TABS = ['all', 'pending', 'approved', 'rejected'];

    const filtered = submissions.filter(s => {
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchesSearch =
            (s.user?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (s.trekkingRoute?.trekking_route_name ?? '').toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Counts for tab badges
    const counts = {
        all:      submissions.length,
        pending:  submissions.filter(s => s.status === 'pending').length,
        approved: submissions.filter(s => s.status === 'approved').length,
        rejected: submissions.filter(s => s.status === 'rejected').length,
    };

    return (
        <AdminLayout title="Community Submissions">
            <Head title="Submissions — TrekSathi Admin" />

            {/* Success snackbar */}
            <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="success" onClose={() => setSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {flash?.success}
                </Alert>
            </Snackbar>

            {/* Error snackbar */}
            <Snackbar open={errorSnackbar} autoHideDuration={5000} onClose={() => setErrorSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="error" onClose={() => setErrorSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {flash?.failed}
                </Alert>
            </Snackbar>

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Community Submissions</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {counts.pending} pending review · {submissions.length} total
                    </Typography>
                </Box>
            </Box>

            {/* Status filter tabs + search */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Tabs
                    value={statusFilter}
                    onChange={(_, v) => setStatusFilter(v)}
                    sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0, textTransform: 'none', fontWeight: 500 } }}
                >
                    {STATUS_TABS.map(s => (
                        <Tab
                            key={s}
                            value={s}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                    <Box sx={{
                                        bgcolor: s === 'pending' ? '#fff3e0' : 'grey.100',
                                        color:   s === 'pending' ? '#e65100'  : 'text.secondary',
                                        borderRadius: '10px', px: 0.75, fontSize: '0.7rem', fontWeight: 700,
                                        lineHeight: '18px', minWidth: 20, textAlign: 'center',
                                    }}>
                                        {counts[s]}
                                    </Box>
                                </Box>
                            }
                        />
                    ))}
                </Tabs>

                <TextField
                    placeholder="Search by user or route…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    size="small"
                    sx={{ width: 260 }}
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
                                {['User', 'Route', 'Experience', 'Trail Condition', 'Status', 'Submitted', 'Actions'].map(h => (
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
                                    <TableCell colSpan={7}>
                                        <Box sx={{ py: 6, textAlign: 'center' }}>
                                            <ArticleIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {search || statusFilter !== 'all'
                                                    ? 'No submissions match your filter.'
                                                    : 'No community submissions yet.'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : filtered.map(s => (
                                <TableRow key={s.id} hover sx={{ '&:last-child td': { border: 0 } }}>

                                    {/* User */}
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>
                                            {s.user?.name ?? '—'}
                                        </Typography>
                                    </TableCell>

                                    {/* Route */}
                                    <TableCell sx={{ maxWidth: 160 }}>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {s.trekkingRoute?.trekking_route_name ?? '—'}
                                        </Typography>
                                    </TableCell>

                                    {/* Experience (truncated, click to expand) */}
                                    <TableCell sx={{ maxWidth: 200 }}>
                                        <Tooltip title="Click to read full experience">
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                noWrap
                                                onClick={() => setViewSubmission(s)}
                                                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                                            >
                                                {s.experience_text}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>

                                    {/* Trail condition */}
                                    <TableCell>
                                        <TrailChip condition={s.trail_condition} />
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <StatusChip status={s.status} />
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </Typography>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell align="right">
                                        {/* Only show approve/reject for pending */}
                                        {s.status === 'pending' && (
                                            <>
                                                <Tooltip title="Approve">
                                                    <IconButton size="small" disabled={processing}
                                                        onClick={() => handleStatusChange(s, 'approved')}
                                                        sx={{ color: 'text.secondary', '&:hover': { color: 'success.main' } }}>
                                                        <CheckCircleOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Reject">
                                                    <IconButton size="small" disabled={processing}
                                                        onClick={() => handleStatusChange(s, 'rejected')}
                                                        sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' } }}>
                                                        <CancelOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                        {/* Revert to pending if already approved/rejected */}
                                        {s.status !== 'pending' && (
                                            <Tooltip title="Reset to pending">
                                                <Chip
                                                    label="Reset"
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleStatusChange(s, 'pending')}
                                                    disabled={processing}
                                                    sx={{ fontSize: '0.65rem', height: 20, cursor: 'pointer', mr: 0.5 }}
                                                />
                                            </Tooltip>
                                        )}
                                        <Tooltip title="Delete">
                                            <IconButton size="small"
                                                onClick={() => setDeleteSubmission(s)}
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

            {/* Dialogs */}
            <DeleteDialog
                open={Boolean(deleteSubmission)}
                onClose={() => setDeleteSubmission(null)}
                submission={deleteSubmission}
            />
            <ExperienceDialog
                open={Boolean(viewSubmission)}
                onClose={() => setViewSubmission(null)}
                submission={viewSubmission}
            />
        </AdminLayout>
    );
}
