require('dotenv').config;
const express = require('express');
const { setupSwagger } = require("./config/swagger");
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());

app.use('/books', bookRoutes); // Semua route di bookRoutes akan diawali /books
app.use('/api/auth', authRoutes);
setupSwagger(app);

app.get('/health', (req,res)=>{
    res.json({status:'OK', timestamp: new Date().toISOString() });
});

app.use((req, res, next) => {
 res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan'});
});

app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).json({message: "Terjadi kesalahan pada server."});
//  const statusCode = err.statusCode || 500;
//  const message = err.message || 'Terjadi kesalahan pada server';
//  res.status(statusCode).json({
//     success: false,
//     message,
//  });
});

app.listen(PORT, () => console.log(`Server berjalan di port ${PORT} \nSwagger UI di: http://localhost:${PORT}/apidocs`));

module.exports = app;