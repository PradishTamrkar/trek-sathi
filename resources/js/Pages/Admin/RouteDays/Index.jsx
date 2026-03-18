import { useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Tooltip,
    Alert, Snackbar, Button, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, Divider, Chip,
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TerrainIcon   from '@mui/icons-material/Terrain';
import AdminLayout   from '../../../Layouts/AdminLayout';
import { useForm, usePage, Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

//create/edit dialog
function DayDialog({open, onClose, day=null, routeId}){
    const isEdit = Boolean(day);

    const { data, setData, post, put, processing, errors, reset} = useForm({
        day_number: day?.day_number ?? '',
        start_point: day?.start_point ?? '',
        end_point: day?.end_point ?? '',
        Distance_in_km: day?.Distance_in_km ?? '',
        altitude: day?.altitude ?? '',
        days_description: day?.days_description ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isEdit){
            put(route('admin.trekkingRoutes.days.update',{trekkingRoute: routeId, day:day.id}),{
                onSuccess: () => {reset(); onClose();},
            });
        }else{
            post(route('admin.trekkingRoutes.days.store'),{trekkingRoute: routeId},{
                onSuccess: () => {reset(); onClose();},
            });
        }
    };
    const handleClose = () => { reset(); onClose();}

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                    {isEdit ? `Edit Day ${day?.day_number}` : 'Add New Day'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Fill in the route day details
                </Typography>
            </DialogTitle>
            <Divider />
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>

                    <TextField
                        label="Day Number" type="number"
                        value={data.day_number}
                        onChange={e => setData('day_number', e.target.value)}
                        error={!!errors.day_number} helperText={errors.day_number}
                        required inputProps={{ min: 1 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Start Point"
                            value={data.start_point}
                            onChange={e => setData('start_point', e.target.value)}
                            error={!!errors.start_point} helperText={errors.start_point}
                            required placeholder="e.g. Lukla"
                        />
                        <TextField
                            label="End Point"
                            value={data.end_point}
                            onChange={e => setData('end_point', e.target.value)}
                            error={!!errors.end_point} helperText={errors.end_point}
                            required placeholder="e.g. Phakding"
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Distance (km)" type="number"
                            value={data.Distance_in_km}
                            onChange={e => setData('Distance_in_km', e.target.value)}
                            error={!!errors.Distance_in_km} helperText={errors.Distance_in_km}
                            required inputProps={{ min: 0 }}
                        />
                        <TextField
                            label="Altitude (m)" type="number"
                            value={data.altitude}
                            onChange={e => setData('altitude', e.target.value)}
                            error={!!errors.altitude} helperText={errors.altitude}
                            required inputProps={{ min: 0 }}
                            placeholder="End point altitude"
                        />
                    </Box>

                    <TextField
                        label="Day Description"
                        value={data.days_description}
                        onChange={e => setData('days_description', e.target.value)}
                        error={!!errors.days_description} helperText={errors.days_description}
                        multiline rows={3}
                        placeholder="Describe what the trekker does on this day…"
                    />
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button onClick={handleClose} color="inherit" disabled={processing}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={processing}>
                        {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Day'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

//Delete Dialog
function DeleteDialog({ open, onClose, day, routeId }){
    const { delete: destroy, processing }= useForm();

    const handleDelete = () => {
        destroy(route('admin.trekkingRoutes.days.destroy', { trekkingRoute: routeId, day: day.id }), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>Delete Day {day?.day_number}</Typography>
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 1 }}>
                    Delete <strong>Day {day?.day_number}: {day?.start_point} → {day?.end_point}</strong>?
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

//Main Page
export default function RouteDaysIndex({ trekkingRoute, routeDays = []}){
    const {flash} = usePage().props;

    const [createOpen, setCreateOpen]=useState(false);
    const [editDay,setEditDay]=useState(null);
    const [deleteDay,setDeleteDay]=useState(null);
    const [snackbar,setSnackbar] = useState(!!flash?.success);
    const [errSnackbar,setErrSnackbar] = useState(!!flash?.failed);

    const sorted = [...routeDays].sort((a,b)=>a.day_number - b.day_number);

    return (
        <AdminLayout title={`Route Days — ${trekkingRoute?.trekking_route_name}`}>
            <Head title={`Route Days — ${trekkingRoute?.trekking_route_name}`} />

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
                        <Typography variant="body2" color="text.secondary">Day-by-Day Itinerary</Typography>
                        <Chip label={`${routeDays.length} days`} size="small"
                            sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
                        <Chip label={`${trekkingRoute?.duration_days} day route`} size="small"
                            sx={{ height: 20, fontSize: '0.7rem' }} />
                    </Box>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
                    Add Day
                </Button>
            </Box>

            {/* Table */}
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.50' }}>
                                {['Day', 'From', 'To', 'Distance', 'Altitude', 'Description', 'Actions'].map(h => (
                                    <TableCell key={h} align={h === 'Actions' ? 'right' : 'left'}
                                        sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase',
                                            letterSpacing: '0.06em', color: 'text.secondary' }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sorted.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <Box sx={{ py: 6, textAlign: 'center' }}>
                                            <TerrainIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                No days added yet. Click "Add Day" to start building the itinerary.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : sorted.map(day => (
                                <TableRow key={day.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                    <TableCell>
                                        <Box sx={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            bgcolor: 'primary.main', color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.8rem', fontWeight: 700,
                                        }}>
                                            {day.day_number}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{day.start_point}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{day.end_point}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{day.Distance_in_km} km</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={`${Number(day.altitude).toLocaleString()}m`} size="small"
                                            sx={{ fontSize: '0.7rem', height: 20, bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600 }} />
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 280 }}>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {day.days_description || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => setEditDay(day)}
                                                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" onClick={() => setDeleteDay(day)}
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

            <DayDialog open={createOpen} onClose={() => setCreateOpen(false)} routeId={trekkingRoute?.id} />
            <DayDialog open={Boolean(editDay)} onClose={() => setEditDay(null)} day={editDay} routeId={trekkingRoute?.id} />
            <DeleteDialog open={Boolean(deleteDay)} onClose={() => setDeleteDay(null)} day={deleteDay} routeId={trekkingRoute?.id} />
        </AdminLayout>
    );

}

