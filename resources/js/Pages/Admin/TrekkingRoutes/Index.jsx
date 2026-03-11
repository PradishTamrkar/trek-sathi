import { useState } from 'react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography, IconButton, Chip, Tooltip, Alert, Paper,
    Snackbar, Divider, InputAdornment, MenuItem, FormControlLabel,
    Switch, Select, InputLabel, FormControl, FormHelperText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, usePage, Head } from '@inertiajs/react';

//Difficulty Options
const DIFFICULTY_MAP = {
    easy: { label: 'Easy', bg: '#e8f5e9', color: '#2e7d32' },
    moderate: { label: 'Moderate', bg: '#fff8e1', color: '#e65100' },
    hard: { label: 'Hard', bg: '#fce4ec', color: '#c62828' },
    hellmode: { label: 'Hell Mode', bg: '#1a0000', color: '#ff1744' }
};

function difficultyOptions({level}){
    const cfg = DIFFICULTY_MAP[level] ?? { label: level, bg: '#f5f5f5', color: '#555' };
    return (
        <Chip
            label={cfg.label}
            size='small'
            sx={{
                fontSize: '0.72rem',
                height:22,
                bgcolor: cfg.bg,
                color:cfg.color,
                fontWeight: 600
            }} />
    )
}

//Create/Edit dailog
function TrekkingRouteDialog({ open, onClose, route=null, regions }) {
    const isEdit = Boolean(route);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        region_id: route?.region_id ?? '',
        trekking_route_name: route?.trekking_route_name ?? '',
        difficulty: route?.difficulty ?? 'moderate',
        duration_days: route?.duration_days ?? '',
        max_altitude: route?.max_altitude ?? '',
        best_season: route?.best_season ?? '',
        permit_required: route?.permit_required ?? false,
        trekking_description: route?.trekking_description ?? '',
        trekking_images: route?.trekking_images ?? [],
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(window.route('admin.trekkingRoutes.update', route.id), {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post(window.route('admin.trekkingRoutes.store'), {
                onSuccess: () => { reset(); onClose(); },
            });
        }
    };

    const handleClose = () => { reset(); onClose(); }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{pb: 1}}>
                    <Typography variant="h6" fontWeight={600}>
                        {isEdit ? 'Edit Trekking Route' : 'Add Trekking Route'}
                    </Typography>
                    <Typography variant="caption" color='text.secondary'>
                        {isEdit ? 'Update route details below' : 'fill in details of new trekking route'}
                    </Typography>
                </DialogTitle>

                <Divider />

                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5,
                        pt: 2.5
                    }}>
                        {/*Region*/}
                        <FormControl fullWidth size='small' error={!!errors.region_id} required>
                            <InputLabel>Region</InputLabel>
                            <Select
                                label="Region"
                                value={data.region_id}
                                onChange={e => setData('region_id', e.target.value)}
                            >
                                {
                                regions.map(r => (
                                    <MenuItem key={r.id} value={r.id}>{r.region_name}</MenuItem>
                                ))
                                }
                            </Select>
                            {errors.region_id && <FormHelperText>{errors.region_id}</FormHelperText>}
                        </FormControl>

                        <TextField
                            label="Trekking Route Name"
                            value={data.trekking_route_name}
                            onChange={e => setData('trekking_route_name', e.target.value)}
                            error={!!errors.trekking_route_name}
                            helperText={errors.trekking_route_name}
                            required
                            placeholder='eg: Everest Base Camp Trek'
                        />

                        {/*Difficulty + Duration*/}
                        <Box sx={{display: 'flex', gap: 2}}>
                            <FormControl fullWidth size='small' error={!!errors.difficulty} required>
                                <InputLabel>Difficulty</InputLabel>
                                <Select
                                    label="Difficulty"
                                    value={data.difficulty}
                                    onChange={e=>setData('difficulty',e.target.value)}>
                                    {Object.entries(DIFFICULTY_MAP).map(([val,cfg])=>(
                                        <MenuItem key={val} value={val}>{cfg.label}</MenuItem>
                                    ))}
                                </Select>
                                {errors.difficulty && <FormHelperText>{errors.difficulty}</FormHelperText>}
                            </FormControl>
                            <TextField
                                label='Duration (days)'
                                type='number'
                                value={data.duration_days}
                                onChange={e => setData('duration_days',e.target.value)}
                                error={!!errors.duration_days}
                                helperText={errors.duration_days}
                                required
                                inputProps={{min:1}}
                            />
                        </Box>

                        {/*Altitude + Season*/}
                        <Box sx={{display: 'flex', gap: 2}}>
                            <TextField
                                label='Maximum Altitude (m)'
                                type='number'
                                value={data.max_altitude}
                                onChange={e => setData('max_altitude',e.target.value)}
                                error={!!errors.max_altitude}
                                helperText={errors.max_altitude}
                                required
                                inputProps={{min:0}}
                            />
                            <TextField
                                label='Best Season'
                                value={data.best_season}
                                onChange={e => setData('best_season',e.target.value)}
                                error={!!errors.best_season}
                                helperText={errors.best_season}
                                required
                                placeholder='eg: Mar-May, Sep-Nov'
                            />
                        </Box>

                        {/*Description*/}
                        <TextField
                            label='Trekking Description'
                            value={data.trekking_description}
                            onChange={e => setData('trekking_description',e.target.value)}
                            error={!!errors.trekking_description}
                            helperText={errors.trekking_description}
                            multiline
                            rows={3}
                            placeholder="Brief Description of this trekking adventure"
                        />

                        {/*toggle permit required*/}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={Boolean(data.permit_required)}
                                    onChange={e => setData('permit_required',e.target.value)}
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant='body2'>
                                    Permit Required
                                </Typography>
                            }
                        />
                    </DialogContent>

                    <Divider/>

                    <DialogActions sx={{px:3, py:2, gap:1}}>
                        <Button onClick={handleClose} color="inherit" disabled={processing}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={processing}>
                            {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Route'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        );
    }

    //Delete confirm dialog

    function DeleteDialog({open, onClose, route}){
        const {delete:destroy, processing } = useForm();

        const handleDelete = () =>{
            destroy(window.route('admin.trekkingRoute.destory',trekking_route.id),
            {
                onSuccess: () =>onClose(),
            });
        };
        return (
            <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth PaperProps={{
                sx:{ borderRadius:3 }
            }}>
                <DialogTitle>
                    <Typography variant='h6' fontWeight={700}>Delete Trekking Route</Typography>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 1 }}>
                        Deleting <strong>{route?.trekking_route_name}</strong> will also remove all associated route days, tea houses, permits, and submissions.
                    </Alert>
                    <Typography variant='body2' color='text.secondary'>
                        This action cannot be undone
                    </Typography>
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

    //Main Page
    export default function TrekkingRoutesIndex({trekkingRoutes,regions}) {
        const {flash} = usePage().props;
        const [search, setSearch] = useState('');
        const [createOpen,setCreateOpen] = useState(false);
        const [editRoute, setEditRoute] = useState(null);
        const [deleteRoute, setDeleteRoute] = useState(null);
        const [snackBar, setSnackBar] = useState(!!flash?.success);

        const filtered = trekkingRoutes.filter(
            r => r.trekking_route_name.toLowerCase().includes(search.toLowerCase()) ||
                (r.region?.region_name ?? '').toLowerCase().includes(search.toLowerCase())
        );

        return (
            <AdminLayout title="Trekking Routes">
                <Head title='Trekking Routes — TrekSathi Admin' />

                {/*Flash reminder*/}
                <Snackbar
                    open={snackBar}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert severity="success" onClose={() => setSnackbar(false)} sx={{ borderRadius: 2 }}>
                        {flash?.success}
                    </Alert>
                </Snackbar>

                {/*header*/}
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                    <Box>
                        <Typography variant='h5' fontWeight={700}>Trekking Routes</Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {trekkingRoutes.length} routes{trekkingRoutes.length !== 1 ? 's' : ''} total
                        </Typography>
                    </Box>
                    <Button variant='contained' startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>Add Route</Button>
                </Box>

                {/*Search*/}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        label="Search Routes or Regions"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size='small'
                        sx={{ width: 300 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize='small' sx={{color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/*Routes Table*/}
                <Paper variant='outlined' sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table size='small'>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.50'}}>
                                    {['Route Name', 'Region', 'Difficulty', 'Duration (days)', 'Max Altitude (m)', 'Best Season', 'Permit Required', 'Actions'].map(h => (
                                        <TableCell key={h}
                                                   align={h === 'Actions'? 'right' : 'left'}
                                                   sx={{ fontWeight: 700, fontSize: '0.75rem',
                                                   textTransform: 'uppercase',
                                                   letterSpacing: 'o.6rem',
                                                   color: 'text.secondary'
                                                }}>{h}
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
                                                    {search ? 'No routes match your search.' : 'No trekking routes yet. Add your first one!'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                filtered.map(r => (
                                    <TableRow key={r.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>{r.trekking_route_name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">{r.regions?.region_name ?? '—'}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <difficultyOptions level={r.difficulty} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{r.duration_days}d</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{r.max_altitude.toLocaleString()}m</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">{r.best_season}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={r.permit_required ? 'Required' : 'None'}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.7rem', height: 20,
                                                    bgcolor: r.permit_required ? '#fff3e0' : '#f5f5f5',
                                                    color:   r.permit_required ? '#e65100'  : '#9e9e9e',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => setEditRoute(r)}
                                                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" onClick={() => setDeleteRoute(r)}
                                                    sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/*Dialog*/}
                <TrekkingRouteDialog
                    open={createOpen}
                    onClose={() => setCreateOpen(false)}
                    regions={regions}
                />
                <TrekkingRouteDialog
                    open={Boolean(editRoute)}
                    onClose={() => setEditRoute(null)}
                    route={editRoute}
                    regions={regions}
                />
                <DeleteDialog
                    open={Boolean(deleteRoute)}
                    onClose={() => setDeleteRoute(null)}
                    route={deleteRoute}
                />
            </AdminLayout>
        )
    }

