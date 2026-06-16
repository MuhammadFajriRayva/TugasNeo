const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message:"Akses ditolak. Token tidak ditemukan.",});
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded =jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name ==="TokenExpiredError") {
            return res.status(401).json({message:"Token telah kedaluwarsa."});
        }
        return res.status(403).json({message: "Token tidak valid."});
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({message:"Autentikasi diperlukan."});
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message:`Akses ditolak. Diperlukan role: ${roles.join(" atau ")}.`,});
        }
        next();
    };
};

module.exports = {authenticate,authorize};