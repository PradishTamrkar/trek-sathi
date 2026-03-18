import { useState } from 'react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography, IconButton, Chip, Tooltip, Alert, Paper,
    Snackbar, Divider, InputAdornment, MenuItem, FormControlLabel,
    Switch, Select, InputLabel, FormControl, FormHelperText,
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import HouseIcon  from '@mui/icons-material/House';
import WifiIcon   from '@mui/icons-material/Wifi';
import BoltIcon   from '@mui/icons-material/Bolt';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, usePage, Head, router } from '@inertiajs/react';

//Create / Edit dialog
function TeaHouseDialog({ open, onClose, teaHouse = null, routes, regions }) {
    const isEdit = Boolean(teaHouse);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        house_name: teaHouse?.house_name || '',
        location: teaHouse?.location || '',
        altitude_location: teaHouse?.altitude_location || '',
        cost_per_night: teaHouse?.cost_per_night || '',
        has_electricity: teaHouse?.has_electricity || false,
        has_wifi: teaHouse?.has_wifi || false,
        trekking_route_id: teaHouse?.trekking_route_id || '',
        region_id: teaHouse?.region_id || '',
        tea_house_images: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            const formData = new FormData();

            formData.append('house_name',data.house_name);
            formData.append('location',data.location);
            formData.append('altitude_location',data.altitude_location);
            formData.append('cost_per_night',data.cost_per_night);
            formData.append('has_electricity',data.has_electricity ? 1 : 0);
            formData.append('has_wifi',data.has_wifi ? 1 : 0);
            formData.append('trekking_route_id',data.trekking_route_id);
            formData.append('region_id',data.region_id);

            if(data.tea_house_images){
                formData.append('tea_house_images', data.tea_house_images);
            }

            formData.append('_method','PUT');

            router.post(route('admin.teaHouses.update', teaHouse.id), formData, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });

        } else {
            router.post(route('admin.teaHouses.store'), data, {
                forceFormData: true,
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
                    {isEdit ? 'Edit Tea House' : 'Add Tea House'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Route and region are optional — the AI will use them for smarter suggestions.
                </Typography>
            </DialogTitle>

            <Divider />

            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>

                    {/* House name — only required field */}
                    <TextField
                        label="House Name"
                        value={data.house_name}
                        onChange={e => setData('house_name', e.target.value)}
                        error={!!errors.house_name} helperText={errors.house_name}
                        required placeholder="e.g. Everest View Hotel"
                    />

                    {/* Location + altitude */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Location"
                            value={data.location}
                            onChange={e => setData('location', e.target.value)}
                            error={!!errors.location} helperText={errors.location}
                            placeholder="e.g. Namche Bazaar"
                        />
                        <TextField
                            label="Altitude (m)" type="number"
                            value={data.altitude_location}
                            onChange={e => setData('altitude_location', e.target.value)}
                            error={!!errors.altitude_location} helperText={errors.altitude_location}
                            inputProps={{ min: 0 }}
                        />
                    </Box>

                    {/* Cost */}
                    <TextField
                        label="Cost per Night (USD)" type="number"
                        value={data.cost_per_night}
                        onChange={e => setData('cost_per_night', e.target.value)}
                        error={!!errors.cost_per_night} helperText={errors.cost_per_night}
                        inputProps={{ min: 0, step: 0.5 }}
                        placeholder="e.g. 8"
                    />

                    {/* Amenity toggles */}
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <FormControlLabel
                            control={
                                <Switch checked={Boolean(data.has_wifi)}
                                    onChange={e => setData('has_wifi', e.target.checked)}
                                    color="primary" />
                            }
                            label={<Typography variant="body2">WiFi Available</Typography>}
                        />
                        <FormControlLabel
                            control={
                                <Switch checked={Boolean(data.has_electricity)}
                                    onChange={e => setData('has_electricity', e.target.checked)}
                                    color="primary" />
                            }
                            label={<Typography variant="body2">Electricity</Typography>}
                        />
                    </Box>

                    {/*image upload*/}
                     <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Tea House Image (JPEG, PNG, WebP — max 5MB)
                        </Typography>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            onChange={e => setData('tea_house_images', e.target.files[0] ?? null)}
                            style={{ width: '100%' }}
                        />
                        {errors.tea_house_images && (
                            <Typography variant="caption" color="error">{errors.tea_house_images}</Typography>
                        )}
                        {isEdit && teaHouse?.tea_house_images && !data.tea_house_images && (
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">Current image:</Typography>
                                <Box component="img" src={teaHouse.tea_house_images} alt="Current"
                                    sx={{ display: 'block', mt: 0.5, height: 80, borderRadius: 1, objectFit: 'cover' }} />
                            </Box>
                        )}
                    </Box>
                    <Divider>
                        <Typography variant="caption" color="text.disabled">
                            Optional — helps AI suggest this tea house
                        </Typography>
                    </Divider>

                    {/* Optional: link to a trekking route */}
                    <FormControl fullWidth size="small" error={!!errors.trekking_route_id}>
                        <InputLabel>Associated Route (optional)</InputLabel>
                        <Select
                            label="Associated Route (optional)"
                            value={data.trekking_route_id}
                            onChange={e => setData('trekking_route_id', e.target.value)}>
                            <MenuItem value="">None</MenuItem>
                            {routes.map(r => (
                                <MenuItem key={r.id} value={r.id}>{r.trekking_route_name}</MenuItem>
                            ))}
                        </Select>
                        {errors.trekking_route_id && <FormHelperText>{errors.trekking_route_id}</FormHelperText>}
                    </FormControl>

                    {/* Optional: link to a region */}
                    <FormControl fullWidth size="small" error={!!errors.region_id}>
                        <InputLabel>Region (optional)</InputLabel>
                        <Select
                            label="Region (optional)"
                            value={data.region_id}
                            onChange={e => setData('region_id', e.target.value)}>
                            <MenuItem value="">None</MenuItem>
                            {regions.map(r => (
                                <MenuItem key={r.id} value={r.id}>{r.region_name}</MenuItem>
                            ))}
                        </Select>
                        {errors.region_id && <FormHelperText>{errors.region_id}</FormHelperText>}
                    </FormControl>
                </DialogContent>

                <Divider />

                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button onClick={handleClose} color="inherit" disabled={processing}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={processing}>
                        {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Tea House'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

//Delete dialog
function DeleteDialog({ open, onClose, teaHouse }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('admin.teaHouses.destroy', teaHouse.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>Delete Tea House</Typography>
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 1 }}>
                    You are about to delete <strong>{teaHouse?.house_name}</strong>.
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

//Main page
export default function TeaHousesIndex({ teaHouses, routes, regions }) {
    const { flash } = usePage().props;

    const [search,        setSearch]        = useState('');
    const [createOpen,    setCreateOpen]    = useState(false);
    const [editHouse,     setEditHouse]     = useState(null);
    const [deleteHouse,   setDeleteHouse]   = useState(null);
    const [snackbar,      setSnackbar]      = useState(!!flash?.success);
    const [errorSnackbar, setErrorSnackbar] = useState(!!flash?.failed);

    const filtered = teaHouses.filter(h =>
        h.house_name.toLowerCase().includes(search.toLowerCase()) ||
        (h.location ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (h.trekking_route?.trekking_route_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (h.region?.region_name ?? '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Tea Houses">
            <Head title="Tea Houses — TrekSathi Admin" />

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
                    <Typography variant="h5" fontWeight={700}>Tea Houses</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {teaHouses.length} tea house{teaHouses.length !== 1 ? 's' : ''} total
                        {' · '}
                        <Box component="span" sx={{ color: 'primary.main', fontSize: '0.78rem' }}>
                            Route &amp; region links help the AI make better suggestions
                        </Box>
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
                    Add Tea House
                </Button>
            </Box>

            {/* Search */}
            <Box sx={{ mb: 3 }}>
                <TextField placeholder="Search by name, location, route or region…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    size="small" sx={{ width: 340 }}
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
                                {['House Name', 'Location', 'Altitude', 'Cost/Night', 'Route', 'Region', 'Amenities', 'Actions'].map(h => (
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
                                    <TableCell colSpan={8}>
                                        <Box sx={{ py: 6, textAlign: 'center' }}>
                                            <HouseIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {search ? 'No tea houses match your search.' : 'No tea houses yet. Add your first one!'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : filtered.map(h => (
                                <TableRow key={h.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{h.house_name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {h.location ?? '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {h.altitude_location ? `${Number(h.altitude_location).toLocaleString()}m` : '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600} color="primary.main">
                                            {h.cost_per_night ? `$${Number(h.cost_per_night).toFixed(0)}` : '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 160 }}>
                                        {h.trekking_route
                                            ? <Chip label={h.trekking_route.trekking_route_name} size="small"
                                                sx={{ fontSize: '0.65rem', height: 20, maxWidth: 150,
                                                    bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 500 }} />
                                            : <Typography variant="caption" color="text.disabled">—</Typography>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {h.region
                                            ? <Typography variant="body2" color="text.secondary">{h.region.region_name}</Typography>
                                            : <Typography variant="caption" color="text.disabled">—</Typography>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                            {h.has_wifi && (
                                                <Tooltip title="WiFi">
                                                    <WifiIcon sx={{ fontSize: 16, color: '#1565c0' }} />
                                                </Tooltip>
                                            )}
                                            {h.has_electricity && (
                                                <Tooltip title="Electricity">
                                                    <BoltIcon sx={{ fontSize: 16, color: '#e65100' }} />
                                                </Tooltip>
                                            )}
                                            {!h.has_wifi && !h.has_electricity && (
                                                <Typography variant="caption" color="text.disabled">None</Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => setEditHouse(h)}
                                                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" onClick={() => setDeleteHouse(h)}
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

            <TeaHouseDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                routes={routes}
                regions={regions}
            />
            <TeaHouseDialog
                key={editHouse?.id ?? 'new'}
                open={Boolean(editHouse)}
                onClose={() => setEditHouse(null)}
                teaHouse={editHouse}
                routes={routes}
                regions={regions}
            />
            <DeleteDialog
            key={deleteHouse?.id ?? 'del'}
                open={Boolean(deleteHouse)}
                onClose={() => setDeleteHouse(null)}
                teaHouse={deleteHouse}
            />
        </AdminLayout>
    );
}
