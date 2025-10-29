import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../utils/api';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    availableCopies: 1 // ✅ Added this for backend consistency
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Title and author are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await addBook(formData);

      if (response?.success) {
        setSuccess(true);
        setFormData({ title: '', author: '', description: '', availableCopies: 1 });
      } else {
        setError(response?.message || 'Failed to add book.');
      }
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Failed to add book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Snackbar close handler
  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSuccess(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Add New Book
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Book Title"
            name="title"
            autoFocus
            value={formData.title}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="author"
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            id="availableCopies"
            label="Available Copies"
            name="availableCopies"
            type="number"
            inputProps={{ min: 1 }}
            value={formData.availableCopies}
            onChange={handleChange}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Book'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* ✅ Snackbar for success message */}
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message="Book added successfully!"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default AddBook;
