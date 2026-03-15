import { useState } from "react";
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography, IconButton, Chip, Tooltip, Alert, Paper,
    Snackbar, Divider, InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm,usePage,Head } from "@inertiajs/react";

//season chip colors
function SeasonChip({season}){
    if(!season){
        return <Typography variant="caption" color="text.disabled">-</Typography>
    }
    return (
        <Chip
            label={season}
            size="small"
            sx={{ fontSize: '0.72rem', height: 22, bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 500 }}/>
    )
}

//create/edit
function RegionDialog({open, onClose, region=null }){
    const isEdit = Boolean(region);

    const {data, setData, post, put, processing, errors, reset} = useForm({
        region_name: region?.region_name || '',
        region_description: region?.region_description || '',
        best_season: region?.best_season || '',
        how_to_reach: region?.how_to_reach || '',
        region_images: region?.region_images || ''
    })

    const handleSubmit=(e)=>{
        e.preventDefault();

        if(isEdit){
            put(route('admin.regions.update',region.id),{
                onSuccess: ()=>{reset(); onClose();}
            })
        }else{
            post(route('admin.regions.store'),{
                onSuccess: ()=>{reset(); onClose();}
            })
        }
    }

    const handleClose=()=>{ reset(); onClose(); }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                    {isEdit ? 'Edit Region' : 'Add New Region'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {isEdit ? 'Update region details below.' : 'Fill in the details for the new trekking region.'}
                </Typography>
            </DialogTitle>

            <Divider />

            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
                    <TextField
                        label="Region Name"
                        value={data.region_name}
                        onChange={e => setData('region_name', e.target.value)}
                        error={!!errors.region_name}
                        helperText={errors.region_name}
                        autoFocus
                        required
                        placeholder="e.g. Everest Region"
                    />

                    <TextField
                        label="Best Season"
                        value={data.best_seasonn}
                        onChange={e => setData('best_season', e.target.value)}
                        error={!!errors.best_season}
                        helperText={errors.best_season}
                        placeholder="e.g. March–May, Sept–Nov"
                    />

                    <TextField
                        label="Region Description"
                        value={data.region_description}
                        onChange={e => setData('region_description', e.target.value)}
                        error={!!errors.region_description}
                        helperText={errors.region_description}
                        multiline
                        rows={3}
                        placeholder="Brief description of this region..."
                    />

                    <TextField
                        label="How to Reach"
                        value={data.how_to_reach}
                        onChange={e => setData('how_to_reach', e.target.value)}
                        error={!!errors.how_to_reach}
                        helperText={errors.how_to_reach}
                        multiline
                        rows={2}
                        placeholder="e.g. Fly to Lukla from Kathmandu..."
                    />
                </DialogContent>

                <Divider />

                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button onClick={handleClose} color="inherit" disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={processing}>
                        {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Region'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

//Delete Confirm Dialog
function DeleteDialog({ open, onClose, region }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('admin.regions.destroy', region.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>Delete Region</Typography>
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 1 }}>
                    This will also delete all trekking routes associated with <strong>{region?.region_name}</strong>.
                </Alert>
                <Typography variant="body2" color="text.secondary">
                    This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={onClose} color="inherit" disabled={processing}>Cancel</Button>
                <Button onClick={handleDelete} variant="contained" color="error" disabled={processing}>
                    {processing ? 'Deleting…' : 'Delete Region'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

//Main Page
export default function RegionsIndex({ regions }) {
    const { flash } = usePage().props;

    const [search, setSearch]           = useState('');
    const [createOpen, setCreateOpen]   = useState(false);
    const [editRegion, setEditRegion]   = useState(null);
    const [deleteRegion, setDeleteRegion] = useState(null);
    const [snackbar, setSnackbar]       = useState(!!flash?.success);

    const filtered = regions.filter(r =>
        r.region_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Regions">
            <Head title="Regions — TrekSathi Admin" />

            {/* Flash snackbar */}
            <Snackbar
                open={snackbar}
                autoHideDuration={3000}
                onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="success" onClose={() => setSnackbar(false)} sx={{ borderRadius: 2 }}>
                    {flash?.success}
                </Alert>
            </Snackbar>

            {/* Page header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Regions</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {regions.length} region{regions.length !== 1 ? 's' : ''} total
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateOpen(true)}
                >
                    Add Region
                </Button>
            </Box>

            {/* Search */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    placeholder="Search regions…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    size="small"
                    sx={{ width: 280 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Table */}
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.50' }}>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.secondary' }}>Region</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.secondary' }}>Best Season</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.secondary' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.secondary' }}>How to Reach</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.secondary' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Box sx={{ py: 6, textAlign: 'center' }}>
                                            <MapIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {search ? 'No regions match your search.' : 'No regions yet. Add your first one!'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map(region => (
                                    <TableRow
                                        key={region.id}
                                        hover
                                        sx={{ '&:last-child td': { border: 0 } }}
                                    >
                                        {/* Name */}
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                {region.region_name}
                                            </Typography>
                                        </TableCell>

                                        {/* Season */}
                                        <TableCell>
                                            <SeasonChip season={region.best_season} />
                                        </TableCell>

                                        {/* Description */}
                                        <TableCell sx={{ maxWidth: 240 }}>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {region.region_description || '—'}
                                            </Typography>
                                        </TableCell>

                                        {/* How to reach */}
                                        <TableCell sx={{ maxWidth: 200 }}>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {region.how_to_reach || '—'}
                                            </Typography>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setEditRegion(region)}
                                                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setDeleteRegion(region)}
                                                    sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                                                >
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

            {/* Dialogs */}
            <RegionDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
            />
            <RegionDialog
                open={Boolean(editRegion)}
                onClose={() => setEditRegion(null)}
                region={editRegion}
            />
            <DeleteDialog
                open={Boolean(deleteRegion)}
                onClose={() => setDeleteRegion(null)}
                region={deleteRegion}
            />
        </AdminLayout>
    )
}
