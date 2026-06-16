const express = require('express');
const {authenticate }= require("../middlewares/authMiddleware");
const { 
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
} = require("../controllers/bookController");
const router = express.Router();

/**
* @swagger
* /api/books:
*   get:
*       tags: [Books]
*       summary: Lihat semua buku (publik)
*       responses:
*           200:
*               description: Daftar buku berhasil diambil
*/

// GET /books - Ambil semua buku
router.get("/", getAllBooks);
/**
* @swagger
* /api/books/{id}:
*   get:
*       tags: [Books]
*       summary: Lihat detail buku (publik)
*       parameters:
*         - in: path
*           name: id
*           required: true
*           schema:
*               type: integer
*           example: 1
*       responses:
*           200:
*               description: Detail buku berhasil diambil
*           404:
*               description: Buku tidak ditemukan
*/

// GET /books/:id - Ambil satu buku
router.get("/:id", getBookById);
/**
* @swagger
* /api/books:
*   post:
*       tags: [Books]
*       summary: Tambah buku baru (perlu login)
*       security:
*         - BearerAuth: []
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       type: object
*                       required: [title, author, price, stock]
*                       properties:
*                           title:
*                               type: string
*                               example: Clean Code
*                           author:
*                               type: string
*                               example: Robert C. Martin
*                           price:
*                               type: number
*                               example: 150000
*                           stock:
*                               type: integer
*                               example: 10
*       responses:
*           201:
*               description: Buku berhasil ditambahkan
*           400:
*               description: Validasi gagal
*           401:
*               description: Unauthorized
*/

// POST /books - Tambah buku baru
router.post("/", authenticate, createBook);
/**
* @swagger
* /api/books/{id}:
*   put:
*       tags: [Books]
*       summary: Update buku (perlu login)
*       security:
*         - BearerAuth: []
*       parameters:
*         - in: path
*           name: id
*           required: true
*           schema:
*               type: integer
*           example: 1
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       type: object
*                       properties:
*                           title:
*                               type: string
*                           author:
*                               type: string
*                           price:
*                               type: number
*                           stock:
*                               type: integer
*       responses:
*           200:
*               description: Buku berhasil diupdate
*           401:
*               description: Unauthorized
*           404:
*               description: Buku tidak ditemukan
*/


// PUT /books/:id - Perbarui buku
router.put("/:id", authenticate, updateBook);
/**
* @swagger
* /api/books/{id}:
*   delete:
*       tags: [Books]
*       summary: Hapus buku (perlu login)
*       security:
*         - BearerAuth: []
*       parameters:
*         - in: path
*           name: id
*           required: true
*           schema:
*               type: integer
*           example: 1
*       responses:
*           200:
*               description: Buku berhasil dihapus
*           401:
*               description: Unauthorized
*           404:
*               description: Buku tidak ditemukan
*/

// DELETE /books/:id - Hapus buku
router.delete("/:id", authenticate, deleteBook);

module.exports = router;