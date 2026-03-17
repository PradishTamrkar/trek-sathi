import { useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Tooltip,
    Alert, Snackbar, Button, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, Divider, Chip, InputAdornment,
    FormControl, InputLabel, Select, MenuItem, FormHelperText,
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, usePage, Head } from '@inertiajs/react';
import { ErrorSharp, RestartAlt } from '@mui/icons-material';
import { searchForWorkspaceRoot } from 'vite';

const CATEGORIES =['General','Safety','Permits','Altitude','Gear','Culture','Food','Weather','Transport'];

//create dialog
function EntryDialog({open, onClose, entry=null, routes=[]}){
    const isEdit=Boolean(entry);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        trekking_route_id: entry?.trekking_route_id ?? '',
        title: entry?.title ?? '',
        content: entry?.content ?? '',
        category: entry?.category ?? '',
        source: entry?.source ?? '',
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isEdit){
            put(route('admin.knowledgeBase.update',entry.id),{
                onSuccess: ()=>{reset(); onClose();},
            });
        }else{
            post(route('admin.knowledgeBase.store'),{
                onSuccess: ()=>{reset(); onClose();},
            });
        }
    }
    const handleClose = ()=>{ reset(); onClose();};

    return(
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{sx: {borderRadius: 3}}}>
            <DialogTitle sx={{pb:1}}>
                <Typography variant='h6' fontWeight={700}>
                    {isEdit? 'Edit Knowledge Entry' : 'Add Knowledge Entry'}
                </Typography>
            </DialogTitle>
            <Divider />
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5}}>
                    <TextField
                        label="Title"
                        value={data.title}
                        onChange={e=>setData('title',e.target.value)}
                        error={!!errors.title} helperText={errors.title}
                        required autoFocus
                        placeholder='eg: Altitude Sickness Prevention Tips'
                    />
                    <Box sx={{displau:'flex', gap: 2}}>
                        {/*Category*/}
                        <FormControl fullWidth size='small' error={!!errors.category}>
                            <InputLabel>Category (optional)</InputLabel>
                            <Select label="Category (optional)" value={data.category} onChange={e=>setData('categgory',e.target.value)}>
                                <MenuItem value="">None</MenuItem>
                                {CATEGORIES.map(c=> <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                            {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                        </FormControl>

                        {/*Associated route*/}
                        <FormControl fullWidth size='small' error={!!errors.trekking_route_id}>
                            <InputLabel>Associated Route(optional)</InputLabel>
                            <Select label="Associated Route(optional)" value={data.trekking_route_id} onChange={e=>setData('trekking_route_id',e.target.value)}>
                                <MenuItem value="">All Routes / General</MenuItem>
                                {routes.map(r=>(
                                    <MenuItem key={r.id} value={r.id}>{r.trekking_route_name}</MenuItem>
                                ))}
                            </Select>
                            {errors.trekking_route_id && <FormHelperText>{errors.trekking_route_id}</FormHelperText>}
                        </FormControl>
                    </Box>
                    <TextField label="Content" value={data.content} onChange={e => setData('content',e.target.value)} error={!!errors.content} helperText={errors.content} required multiline rows={8} placeholder='Write the knowledge content here' />
                    <TextField label="Source (optional)" value={data.source} onChange={e=>setData('source',e.target.value)} error={!!errors.source} helperText={errors.source} placeholder='eg: Nepal Toursim Board, personal experience' />
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2, gap:1}}>
                    <Button onClick={handleClose} color="inherit" disabled={processing}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={processing}>
                        {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Entry'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

//Delete dialog
function DeleteDialog({open, onClose, entry}){
    const {delete: destroy, processing } = useForm();

    const handleDelete=()=>{
        destroy(route('admin.knowledgeBase.destroy',entry.id),{
            onSuccess:()=>onClose(),
        });
    };

    return(
         <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>Delete Entry</Typography>
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 1 }}>
                    Delete <strong>"{entry?.title}"</strong>?
                </Alert>
                <Typography variant="body2" color="text.secondary">
                    This will remove the knowledge from the AI context. Cannot be undone.
                </Typography>
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

//Category Chip
const CATEGORY_COLORS = {
    Safety:    { bg: '#fce4ec', color: '#c62828' },
    Permits:   { bg: '#fff3e0', color: '#e65100' },
    Altitude:  { bg: '#e3f2fd', color: '#1565c0' },
    Gear:      { bg: '#f3e5f5', color: '#6a1b9a' },
    Culture:   { bg: '#e0f2f1', color: '#00695c' },
    Weather:   { bg: '#e8eaf6', color: '#283593' },
    Transport: { bg: '#f9fbe7', color: '#558b2f' },
    General:   { bg: '#f5f5f5', color: '#555' },
    Food:      { bg: '#fff8e1', color: '#f57f17' },
}

function CategoryChip({category}){
    if(!category)
        return <Typography variant='caption' color="text.disabled">-</Typography>

    const cfg = CATEGORY_COLORS[category]??{bg: '#f5f5f5', color:'#555'};
    return (
        <Chip label={category} size="small"
            sx={{ fontSize: '0.68rem', height: 20, fontWeight: 600, bgcolor: cfg.bg, color: cfg.color }} />
    );
}

//Main Page
export default function KnowledgeBaseIndex({ entries =[], routes =[]}){
    const { flash }=usePage().props;

    const [search,setSearch] = useState('');
    const [catFilter,setCatFilter] = useState('');
    const [createOpen,setCreateOpen] = useState(false);
    const [editEntry,setEditEntry] = useState(null);
    const [deleteEntry,setDeleteEntry] = useState(null);
    const [snachbar,setSnackbar] = useState(!!flash?.success);
    const [errSnackbar,setErrSnackbar] = useState(!!flash?.failed);

    const filtered = entries.filter(e => {
        const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.content.toLowerCase().includes(search.toLowerCase());
        const matchCat = !catFilter || e.category === catFilter;
        return matchSearch && matchCat;
    });

    return (
        <AdminLayout title="Knowledge Base">
            <Head title="Knowledge Base — TrekSathi Admin" />

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
                    <Typography variant="h5" fontWeight={700}>Knowledge Base</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'} · Used as context by the AI planner
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
                    Add Entry
                </Button>
            </Box>

            {/* Info banner */}
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Entries here are injected as context when the AI answers trekking questions.
                The more detailed and accurate these are, the better the AI performs.
            </Alert>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                    placeholder="Search entries…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    size="small" sx={{ width: 280 }}
                    InputProps={{ startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    )}}
                />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Category</InputLabel>
                    <Select label="Category" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                        <MenuItem value="">All Categories</MenuItem>
                        {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>

            {/* Table */}
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.50' }}>
                                {['Title', 'Category', 'Route', 'Content Preview', 'Source', 'Actions'].map(h => (
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
                                            <AutoStoriesIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {search || catFilter
                                                    ? 'No entries match your filter.'
                                                    : 'No knowledge entries yet. Add your first one!'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : filtered.map(e => (
                                <TableRow key={e.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                    <TableCell sx={{ maxWidth: 200 }}>
                                        <Typography variant="body2" fontWeight={600} noWrap>{e.title}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <CategoryChip category={e.category} />
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 160 }}>
                                        {e.TrekkingRoutes
                                            ? <Chip label={e.TrekkingRoutes.trekking_route_name} size="small"
                                                sx={{ fontSize: '0.65rem', height: 20, maxWidth: 150,
                                                    bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 500 }} />
                                            : <Typography variant="caption" color="text.disabled">All Routes</Typography>
                                        }
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 280 }}>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {e.content}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 120 }}>
                                        <Typography variant="caption" color="text.secondary" noWrap>
                                            {e.source || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => setEditEntry(e)}
                                                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" onClick={() => setDeleteEntry(e)}
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

            <EntryDialog open={createOpen} onClose={() => setCreateOpen(false)} routes={routes} />
            <EntryDialog open={Boolean(editEntry)} onClose={() => setEditEntry(null)} entry={editEntry} routes={routes} />
            <DeleteDialog open={Boolean(deleteEntry)} onClose={() => setDeleteEntry(null)} entry={deleteEntry} />
        </AdminLayout>
    )
}
