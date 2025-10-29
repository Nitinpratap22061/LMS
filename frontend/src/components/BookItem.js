import React, { useContext, useState } from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Divider, Box, Avatar, IconButton, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert } from '@mui/material';
import { Delete, ExpandMore, ExpandLess } from '@mui/icons-material';
import AuthContext from '../context/AuthContext';
import { requestBook, deleteBook } from '../utils/api';

const BookItem = ({ book, onDelete, onRequest }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const bookInitial = book.title.charAt(0).toUpperCase();

  const generateGradient = (title) => {
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue1 = hash % 360;
    const hue2 = (hash * 1.5) % 360;
    return theme.palette.mode === 'dark' 
      ? `linear-gradient(135deg, hsl(${hue1}, 80%, 40%), hsl(${hue2}, 85%, 35%))`
      : `linear-gradient(135deg, hsl(${hue1}, 90%, 60%), hsl(${hue2}, 95%, 50%))`;
  };

  const handleRequestBook = async () => {
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: 'You need to be logged in to request books', severity: 'warning' });
      return;
    }
    try {
      setLoading(true);
      await requestBook(book._id);
      setSnackbar({ open: true, message: 'Book request sent successfully!', severity: 'success' });
      onRequest && onRequest(book._id);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to request book. Try again.', severity: 'error' });
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    try {
      setLoading(true);
      await deleteBook(book._id);
      setSnackbar({ open: true, message: 'Book deleted successfully!', severity: 'success' });
      onDelete && onDelete(book._id);
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete book. Try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = () => setExpanded(!expanded);
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden', backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#fff' }}>
        <Box sx={{ width: '100%', height: 200, background: generateGradient(book.title), display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <Avatar sx={{ width: 90, height: 90, bgcolor: 'white', color: '#333', fontSize: '2.2rem', fontWeight: 'bold' }}>{bookInitial}</Avatar>
          {user?.role === 'admin' && (
            <IconButton sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(0,0,0,0.2)' }} onClick={handleDelete}><Delete /></IconButton>
          )}
        </Box>
        <CardContent sx={{ pt: 4, px: 4, pb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 1.5 }}>{book.title}</Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 2.5, fontStyle: 'italic' }}>By {book.author}</Typography>
          
          {/* Corrected available books chip */}
          <Chip 
            label={`${book.quantity} available`} 
            color={book.quantity > 0 ? "primary" : "error"} 
            size="small" 
            sx={{ mb: 3, px: 1 }}
          />

          {book.description && (
            <>
              <Divider sx={{ width: '100%', mb: 2.5 }} />
              <Box sx={{ width: '100%', mb: 2 }}>
                <Typography variant="body2" sx={{ maxHeight: expanded ? 'none' : '4.5em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 3, WebkitBoxOrient: 'vertical' }}>
                  {book.description}
                </Typography>
                {book.description.length > 120 && (
                  <Button size="small" onClick={toggleExpanded} endIcon={expanded ? <ExpandLess /> : <ExpandMore />}>
                    {expanded ? 'Read less' : 'Read more'}
                  </Button>
                )}
              </Box>
            </>
          )}
        </CardContent>

        <CardActions sx={{ p: 4, pt: 0 }}>
          {user?.role === 'student' && (
            <Button fullWidth variant="contained" onClick={() => setDialogOpen(true)} disabled={loading || book.quantity < 1}>Request Book</Button>
          )}
          {user?.role === 'admin' && (
            <Button fullWidth variant="outlined" color="error" onClick={handleDelete} disabled={loading}>Delete Book</Button>
          )}
        </CardActions>
      </Card>

      {/* Request Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Request Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to request <strong>{book.title}</strong> by {book.author}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRequestBook} variant="contained" disabled={loading}>Confirm Request</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default BookItem;
