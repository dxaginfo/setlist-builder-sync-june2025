import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
  SelectChangeEvent,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  SortByAlpha as SortIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon,
  MoreVert as MoreIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchSetlists, deleteSetlist, archiveSetlist } from '../../store/slices/setlistsSlice';
import { fetchBands } from '../../store/slices/bandsSlice';
import SetlistCard from '../../components/setlists/SetlistCard';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingScreen from '../../components/common/LoadingScreen';
import SetlistFilters from '../../components/setlists/SetlistFilters';
import NoDataMessage from '../../components/common/NoDataMessage';

const SetlistsPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { setlists, pagination, loading, error } = useAppSelector((state) => state.setlists);
  const { bands } = useAppSelector((state) => state.bands);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedBandId, setSelectedBandId] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [selectedSetlist, setSelectedSetlist] = useState<string | null>(null);
  
  // Load setlists and bands on component mount
  useEffect(() => {
    dispatch(fetchBands());
    loadSetlists();
  }, [dispatch, page, limit, sortBy, sortOrder, showArchived, selectedBandId]);
  
  // Function to load setlists with current filters
  const loadSetlists = () => {
    dispatch(fetchSetlists({
      page,
      limit,
      search: searchTerm,
      sortBy,
      sortOrder,
      archived: showArchived,
      bandId: selectedBandId
    }));
  };
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle search form submission
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1); // Reset to first page
    loadSetlists();
  };
  
  // Handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  // Handle limit change
  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    setLimit(Number(event.target.value));
    setPage(1); // Reset to first page
  };
  
  // Handle sort change
  const handleSortByChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };
  
  // Handle sort order change
  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
  };
  
  // Handle archived filter change
  const handleArchivedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowArchived(event.target.checked);
    setPage(1); // Reset to first page
  };
  
  // Handle band filter change
  const handleBandChange = (event: SelectChangeEvent<string>) => {
    setSelectedBandId(event.target.value);
    setPage(1); // Reset to first page
  };
  
  // Open delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setSelectedSetlist(id);
    setDeleteDialogOpen(true);
  };
  
  // Open archive confirmation dialog
  const handleArchiveClick = (id: string) => {
    setSelectedSetlist(id);
    setArchiveDialogOpen(true);
  };
  
  // Handle setlist deletion
  const handleDelete = async () => {
    if (selectedSetlist) {
      await dispatch(deleteSetlist(selectedSetlist));
      setDeleteDialogOpen(false);
      loadSetlists();
    }
  };
  
  // Handle setlist archiving
  const handleArchive = async () => {
    if (selectedSetlist) {
      await dispatch(archiveSetlist({ id: selectedSetlist, archived: true }));
      setArchiveDialogOpen(false);
      loadSetlists();
    }
  };
  
  if (loading && setlists.length === 0) {
    return <LoadingScreen />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Setlists
        </Typography>
        <Button
          component={RouterLink}
          to="/setlists/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Create Setlist
        </Button>
      </Box>
      
      {/* Search and filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={4}>
              <form onSubmit={handleSearchSubmit}>
                <TextField
                  fullWidth
                  label="Search Setlists"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit" edge="end">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </form>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="band-filter-label">Filter by Band</InputLabel>
                <Select
                  labelId="band-filter-label"
                  value={selectedBandId}
                  onChange={handleBandChange}
                  label="Filter by Band"
                >
                  <MenuItem value="">All Bands</MenuItem>
                  {bands.map((band) => (
                    <MenuItem key={band.id} value={band.id}>
                      {band.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={sortBy}
                  onChange={handleSortByChange}
                  label="Sort By"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleSortOrderChange} 
                        edge="end"
                        sx={{ 
                          transform: `rotate(${sortOrder === 'ASC' ? 0 : 180}deg)`,
                          transition: 'transform 0.2s'
                        }}
                      >
                        <SortIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                >
                  <MenuItem value="updatedAt">Last Updated</MenuItem>
                  <MenuItem value="createdAt">Created Date</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="date">Event Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel id="results-per-page-label">Results</InputLabel>
                <Select
                  labelId="results-per-page-label"
                  value={limit}
                  onChange={handleLimitChange}
                  label="Results"
                >
                  <MenuItem value={5}>5 per page</MenuItem>
                  <MenuItem value={10}>10 per page</MenuItem>
                  <MenuItem value={25}>25 per page</MenuItem>
                  <MenuItem value={50}>50 per page</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <SetlistFilters
              showArchived={showArchived}
              onArchivedChange={handleArchivedChange}
            />
            <IconButton onClick={loadSetlists} title="Refresh">
              <RefreshIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
      
      {/* Error message */}
      {error && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      {/* Setlists grid */}
      {setlists.length > 0 ? (
        <Grid container spacing={3}>
          {setlists.map((setlist) => (
            <Grid item key={setlist.id} xs={12} sm={6} md={4}>
              <SetlistCard
                setlist={setlist}
                onDelete={() => handleDeleteClick(setlist.id)}
                onArchive={() => handleArchiveClick(setlist.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoDataMessage
          title="No setlists found"
          message={
            searchTerm
              ? "No setlists match your search criteria. Try adjusting your filters or search term."
              : "You haven't created any setlists yet. Click the button above to create your first setlist."
          }
          icon={<EventIcon sx={{ fontSize: 64 }} />}
        />
      )}
      
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            shape="rounded"
            size="large"
          />
        </Box>
      )}
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Setlist"
        message="Are you sure you want to delete this setlist? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
      
      {/* Archive Confirmation Dialog */}
      <ConfirmDialog
        open={archiveDialogOpen}
        title="Archive Setlist"
        message="Are you sure you want to archive this setlist? Archived setlists won't appear in your main list but can be accessed later."
        confirmText="Archive"
        cancelText="Cancel"
        confirmColor="warning"
        onConfirm={handleArchive}
        onCancel={() => setArchiveDialogOpen(false)}
      />
    </Container>
  );
};

export default SetlistsPage;