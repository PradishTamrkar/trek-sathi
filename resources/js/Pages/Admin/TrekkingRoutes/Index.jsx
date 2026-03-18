import { useState } from 'react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography, IconButton, Chip, Tooltip, Alert, Paper,
    Snackbar, Divider, InputAdornment, MenuItem, FormControlLabel,
    Switch, Select, InputLabel, FormControl, FormHelperText,
} from '@mui/material';
import AddIcon      from '@mui/icons-material/Add';
import EditIcon     from '@mui/icons-material/Edit';
import DeleteIcon   from '@mui/icons-material/Delete';
import SearchIcon   from '@mui/icons-material/Search';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import TodayIcon    from '@mui/icons-material/Today';        // ← Days button
import ArticleIcon  from '@mui/icons-material/Article';     // ← Permits button
import AdminLayout  from '../../../Layouts/AdminLayout';
import { useForm, usePage, Head, router } from '@inertiajs/react';

const DIFFICULTY_MAP = {
    easy:     { label: 'Easy',      bg: '#e8f5e9', color: '#2e7d32' },
    moderate: { label: 'Moderate',  bg: '#fff8e1', color: '#e65100' },
    hard:     { label: 'Hard',      bg: '#fce4ec', color: '#c62828' },
    hellmode: { label: 'Hell Mode', bg: '#1a0000', color: '#ff1744' },
};

function DifficultyChip({ level }) {
    const cfg = DIFFICULTY_MAP[level] ?? { label: level, bg: '#f5f5f5', color: '#555' };
    return (
        <Chip label={cfg.label} size="small"
            sx={{ fontSize: '0.72rem', height: 22, bgcolor: cfg.bg, color: cfg.color, fontWeight: 600 }} />
    );
}

// ── Create / Edit dialog ──────────────────────────────────────────────────────
function TrekkingRouteDialog({ open, onClose, trekkingRoute = null, regions }) {
    const isEdit = Boolean(trekkingRoute);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        region_id:            trekkingRoute?.region_id            ?? '',
        trekking_route_name:  trekkingRoute?.trekking_route_name  ?? '',
        difficulty:           trekkingRoute?.difficulty           ?? 'moderate',
        duration_days:        trekkingRoute?.duration_days        ?? '',
        max_altitude:         trekkingRoute?.max_altitude         ?? '',
        best_season:          trekkingRoute?.best_season          ?? '',
        permit_required:      trekkingRoute?.permit_required      ?? false,
        trekking_description: trekkingRoute?.trekking_description ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.trekkingRoutes.update', trekkingRoute.id), {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post(route('admin.trekkingRoutes.store'), {
                onSuccess: () => { reset(); onClose(); },
            });
        }
    };

    const handleClose = () => { reset(); onClose(); };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                    {isEdit ? 'Edit Trekking Route' : 'Add Trekking Route'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {isEdit ? 'Update route details below.' : 'Fill in details of new trekking route.'}
                </Typography>
            </DialogTitle>
            <Divider />
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>

                    <FormControl fullWidth size="small" error={!!errors.region_id} required>
                        <InputLabel>Region</InputLabel>
                        <Select label="Region" value={data.region_id}
                            onChange={e => setData('region_id', e.target.value)}>
                            {regions.map(r => (
                                <MenuItem key={r.id} value={r.id}>{r.region_name}</MenuItem>
                            ))}
                        </Select>
                        {errors.region_id && <FormHelperText>{errors.region_id}</FormHelperText>}
                    </FormControl>

                    <TextField label="Trekking Route Name" value={data.trekking_route_name}
                        onChange={e => setData('trekking_route_name', e.target.value)}
                        error={!!errors.trekking_route_name} helperText={errors.trekking_route_name}
                        required placeholder="e.g. Everest Base Camp Trek" />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth size="small" error={!!errors.difficulty} required>
                            <InputLabel>Difficulty</InputLabel>
                            <Select label="Difficulty" value={data.difficulty}
                                onChange={e => setData('difficulty', e.target.value)}>
                                {Object.entries(DIFFICULTY_MAP).map(([val, cfg]) => (
                                    <MenuItem key={val} value={val}>{cfg.label}</MenuItem>
                                ))}
                            </Select>
                            {errors.difficulty && <FormHelperText>{errors.difficulty}</FormHelperText>}
                        </FormControl>
                        <TextField label="Duration (days)" type="number" value={data.duration_days}
                            onChange={e => setData('duration_days', e.target.value)}
                            error={!!errors.duration_days} helperText={errors.duration_days}
                            required inputProps={{ min: 1 }} />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Maximum Altitude (m)" type="number" value={data.max_altitude}
                            onChange={e => setData('max_altitude', e.target.value)}
                            error={!!errors.max_altitude} helperText={errors.max_altitude}
                            required inputProps={{ min: 0 }} />
                        <TextField label="Best Season" value={data.best_season}
                            onChange={e => setData('best_season', e.target.value)}
                            error={!!errors.best_season} helperText={errors.best_season}
                            required placeholder="e.g. Mar–May, Sep–Nov" />
                    </Box>

                    <TextField label="Trekking Description" value={data.trekking_description}
                        onChange={e => setData('trekking_description', e.target.value)}
                        error={!!errors.trekking_description} helperText={errors.trekking_description}
                        multiline rows={3} placeholder="Brief description of this trekking adventure..." />

                    <FormControlLabel
                        control={
                            <Switch checked={Boolean(data.permit_required)}
                                onChange={e => setData('permit_required', e.target.checked)}
                                color="primary" />
                        }
                        label={<Typography variant="body2">Permit Required</Typography>}
                    />
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button onClick={handleClose} color="inherit" disabled={processing}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={processing}>
                        {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Trekking Route'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

// ── Delete dialog ─────────────────────────────────────────────────────────────
function DeleteDialog({ open, onClose, trekkingRoute }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('admin.trekkingRoutes.destroy', trekkingRoute.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>Delete Trekking Route</Typography>
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 1 }}>
                    Deleting <strong>{trekkingRoute?.trekking_route_name}</strong> will also remove all
                    associated route days, permits, tea houses, and submissions.
                </Alert>
                <Typography variant="body2" color="text.secondary">This action cannot be undone.</Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={onClose} color="inherit" disabled={processing}>Cancel</Button>
                <Button onClick={handleDelete} variant="contained" color="error" disabled={processing}>
                    {processing ? 'Deleting…' : 'Delete Route'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TrekkingRoutesIndex({ trekkingRoutes, regions }) {
    const { flash } = usePage().props;

    const [search,        setSearch]        = useState('');
    const [createOpen,    setCreateOpen]    = useState(false);
    const [editRoute,     setEditRoute]     = useState(null);
    const [deleteRoute,   setDeleteRoute]   = useState(null);
    const [snackbar,      setSnackbar]      = useState(!!flash?.success);
    const [errorSnackbar, setErrorSnackbar] = useState(!!flash?.failed);

    const filtered = trekkingRoutes.filter(r =>
        r.trekking_route_name.toLowerCase().includes(search.toLowerCase()) ||
        (r.regions?.region_name ?? '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Trekking Routes">
            <Head title="Trekking Routes — TrekSathi Admin" />

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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Trekking Routes</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {trekkingRoutes.length} route{trekkingRoutes.length !== 1 ? 's' : ''} total
                        {' · '}
                        <Box component="span" sx={{ color: 'primary.main', fontSize: '0.78rem' }}>
                            Use the 📅 and 📋 icons on each row to manage days and permits
                        </Box>
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
                    Add Route
                </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
                <TextField placeholder="Search routes or regions…" value={search}
                    onChange={e => setSearch(e.target.value)} size="small" sx={{ width: 300 }}
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
                                {['Route Name', 'Region', 'Difficulty', 'Duration', 'Max Alt', 'Best Season', 'Permit', 'Actions'].map(h => (
                                    <TableCell key={h} align={h === 'Actions' ? 'right' : 'left'}
                                        sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase',
                                            letterSpacing: '0.06em', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8}>
                                        <Box sx={{ py: 6, textAlign: 'center' }}>
                                            <AltRouteIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {search ? 'No routes match your search.' : 'No trekking routes yet.'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : filtered.map(r => (
                                <TableRow key={r.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{r.trekking_route_name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {r.regions?.region_name ?? '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <DifficultyChip level={r.difficulty} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{r.duration_days}d</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {Number(r.max_altitude).toLocaleString()}m
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">{r.best_season}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={r.permit_required ? 'Required' : 'None'}
                                            size="small"
                                            sx={{
                                                fontSize: '0.7rem', height: 20, fontWeight: 600,
                                                bgcolor: r.permit_required ? '#fff3e0' : '#f5f5f5',
                                                color:   r.permit_required ? '#e65100'  : '#9e9e9e',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {/* ── Days button ── */}
                                        <Tooltip title="Manage Route Days">
                                            <IconButton size="small"
                                                onClick={() => router.visit(
                                                    route('admin.trekkingRoutes.days.index', r.id)
                                                )}
                                                sx={{ color: 'text.secondary', '&:hover': { color: '#1565c0' } }}>
                                                <TodayIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        {/* ── Permits button ── */}
                                        <Tooltip title="Manage Permits">
                                            <IconButton size="small"
                                                onClick={() => router.visit(
                                                    route('admin.trekkingRoutes.permits.index', r.id)
                                                )}
                                                sx={{ color: 'text.secondary', '&:hover': { color: '#e65100' } }}>
                                                <ArticleIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        {/* ── Edit ── */}
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => setEditRoute(r)}
                                                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        {/* ── Delete ── */}
                                        <Tooltip title="Delete">
                                            <IconButton size="small" onClick={() => setDeleteRoute(r)}
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

            <TrekkingRouteDialog open={createOpen} onClose={() => setCreateOpen(false)} regions={regions} />
            <TrekkingRouteDialog open={Boolean(editRoute)} onClose={() => setEditRoute(null)}
                trekkingRoute={editRoute} regions={regions} />
            <DeleteDialog open={Boolean(deleteRoute)} onClose={() => setDeleteRoute(null)} trekkingRoute={deleteRoute} />
        </AdminLayout>
    );
}
