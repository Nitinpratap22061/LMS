import axios from 'axios';

const API_URL = 'https://lms-rnw6.onrender.com/api';

// ✅ Create a reusable Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// ✅ Attach token automatically (for protected routes)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // token stored at login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ======================
// 📚 BOOKS API
// ======================

export const fetchBooks = async () => {
  try {
    const res = await api.get('/books');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const addBook = async (bookData) => {
  try {
    const res = await api.post('/books/add', bookData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const deleteBook = async (bookId) => {
  try {
    const res = await api.delete(`/books/${bookId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ======================
// 📖 ISSUE REQUESTS (Users)
// ======================

export const requestBook = async (bookId) => {
  try {
    const res = await api.post(`/requests/request/${bookId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ======================
// 👨‍🏫 ADMIN: APPROVE / REJECT REQUESTS
// ======================

export const approveRequest = async (requestId) => {
  try {
    const res = await api.post(`/requests/approve/${requestId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const rejectRequest = async (requestId, message = '') => {
  try {
    const res = await api.post(`/requests/reject/${requestId}`, { message });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ======================
// 📘 ISSUES (Borrow/Return)
// ======================

export const issueBook = async (bookId) => {
  try {
    const res = await api.post(`/issues/issue/${bookId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const returnBook = async (bookId) => {
  try {
    const res = await api.post(`/issues/return/${bookId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getUserIssues = async () => {
  try {
    const res = await api.get('/issues/my');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ======================
// 🧾 ADMIN: GET ALL
// ======================

export const getAllRequests = async () => {
  try {
    const res = await api.get('/requests/requests');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getAllIssues = async () => {
  try {
    const res = await api.get('/issues/all');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ======================
// 🙋‍♂️ USER REQUEST HISTORY
// ======================

export const getUserRequests = async () => {
  try {
    const res = await api.get('/requests/my-requests');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
