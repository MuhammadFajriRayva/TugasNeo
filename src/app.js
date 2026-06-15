const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use('/books', bookRoutes); // Semua route di bookRoutes akan diawali /books

app.use((req, res, next) => {
 res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan'});
});

app.use((err, req, res, next) => {
 console.error(err.stack);
 const statusCode = err.statusCode || 500;
 const message = err.message || 'Terjadi kesalahan pada server';
 res.status(statusCode).json({
    success: false,
    message,
 });
});

module.exports = app;