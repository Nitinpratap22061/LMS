import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, Typography, Grid, Box, TextField, InputAdornment,
  CircularProgress, Alert, Divider, useTheme, useMediaQuery,
  Button, Paper, Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import BookIcon from '@mui/icons-material/Book';
import BookItem from '../components/BookItem';
import { fetchBooks } from '../utils/api';
import { ThemeContext } from '../App';

const BooksList = () => {
  const theme = useTheme();
  const { mode } = useContext(ThemeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks();
        setBooks(data);
        setFilteredBooks(data);
      } catch (err) {
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getBooks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = books.filter(
        book => 
          book.title.toLowerCase().includes(lowercasedSearch) ||
          book.author.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  const handleBookDelete = (deletedBookId) => {
    setBooks(prevBooks => prevBooks.filter(book => book._id !== deletedBookId));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => setSearchTerm('');

  if (loading) {
    return (
      <Box sx={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        height: '80vh', width: '100%',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #111, #1a1a1a)'
          : 'linear-gradient(135deg, #f5f7fa, #e4e8f0)'
      }}>
        <Box sx={{
          position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)' }
          }
        }}>
          <BookIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2, filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.15))' }} />
          <CircularProgress size={120} thickness={2} sx={{ position: 'absolute', color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(25,118,210,0.1)' }} />
          <CircularProgress size={120} thickness={2} sx={{ position: 'absolute', animationDuration: '3s', color: theme.palette.primary.main }} />
        </Box>
        <Typography variant="h5" sx={{ mt: 4, fontWeight: 600, color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)', letterSpacing: '0.5px', textAlign: 'center' }}>
          Loading Library Collection
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', textAlign: 'center' }}>
          Preparing an immersive reading experience for you...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #111, #242424)' : 'linear-gradient(135deg, #f8fafc, #e6eaf0)', minHeight: '100vh', pt: { xs: 2, md: 4 }, pb: { xs: 5, md: 8 }, position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Paper elevation={theme.palette.mode === 'dark' ? 8 : 2} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: { xs: 2, md: 3 }, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.6)', boxShadow: theme.palette.mode === 'dark' ? '0 15px 35px rgba(0, 0, 0, 0.2)' : '0 15px 35px rgba(0, 0, 0, 0.1)' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-end' }, justifyContent: 'space-between', mb: { xs: 3, md: 5 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocalLibraryIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: { xs: 40, md: 50 } }} />
                <Typography variant={isMobile ? "h4" : "h3"} component="h1" sx={{ fontWeight: 800, color: theme.palette.mode === 'dark' ? 'white' : '#1a1a1a' }}>
                  Library Books
                </Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ textAlign: { xs: 'center', sm: 'left' }, color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)', mb: 2 }}>
                Explore our curated collection of books and request titles that inspire you
              </Typography>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: '40%' }, mt: { xs: 3, sm: 0 } }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon color="primary" sx={{ opacity: 0.8 }} /></InputAdornment>,
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <Button size="small" onClick={clearSearch}>Clear</Button>
                    </InputAdornment>
                  )
                }}
              />
              {searchTerm && filteredBooks.length > 0 && (
                <Box sx={{ fontSize: '0.75rem', mt: 1 }}>
                  Found {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 4, height: '2px', background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }} />

          {error && <Alert severity="error">{error}</Alert>}

          {filteredBooks.length === 0 && !loading && !error && <Alert severity="info">No books found</Alert>}

          <Grid container spacing={4}>
            {filteredBooks.map((book, index) => (
              <Fade in={true} key={book._id} timeout={500 + (index % 8) * 100}>
                <Grid item xs={12} md={6}>
                  <BookItem book={book} onDelete={handleBookDelete} />
                </Grid>
              </Fade>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default BooksList;
