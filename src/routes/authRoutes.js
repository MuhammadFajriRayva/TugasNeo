const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const {authenticate,authorize} = require("../middlewares/authMiddleware");

router.post("/register",authController.register);

router.post("/login",authController.login);

router.post("/token/refresh",authController.refreshToken);

router.post("/logout",authenticate,authController.logout);

router.get("/profile",authenticate,(req, res) => {
    res.json({message: `Selamat datang!`,user: req.user});
});

router.get("/admin",authenticate,authorize("ADMIN"),(req, res) => {
    res.json({message: "Selamat datang admin"});
});

router.put("/profile/change-password",authenticate,authController.changePassword);

router.get("/admin/dashboard",authenticate,authorize("ADMIN"),(req, res) => {
    res.json({message:"Dashboard admin."});
});

router.get('/content/review',authenticate,authorize("ADMIN","MODERATOR"),(req,res) => { 
    res.json({message: "Halaman review konten."});
});

module.exports = router;