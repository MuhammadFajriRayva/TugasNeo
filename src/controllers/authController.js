const authService = require("../services/authService");

const {registerSchema,loginSchemaFull,changePasswordSchema} = require("../validations/authValidation");

const authController = {
    async register(req, res) {
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validasi gagal.',
                errors: validation.error.errors.map(e => ({
                    field: e.path.join("."),
                    message: e.message,
                })),
            });
        }
      
        try{
            const user = await authService.register(validation.data);
            return res.status(201).json({message: "Registrasi berhasil.", data: user});
        } catch (error) {
            if(error.message === 'EMAIL_ALREADY_EXIST'){
                return res.status(409).json({message: "Email sudah terdaftar."});
            }
            if(error.message === 'FORBIDDEN_ROLE'){
                return res.status(403).json({message: "Tidak diizinkan membuat akun ADMIN."});
            }
            return res.status(500).json({message: "Terjadi kesalahan server."});
        }
    },

    async login(req, res) {
        const validation = loginSchemaFull.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validasi gagal.',
                errors: validation.error.errors.map(e => ({
                    field: e.path.json("."),
                    message: e.message,
                })),
            });
        }
        try{
            const tokens = await authService.login(validation.data);
            return res.status(200).json({message: "Login berhasil.",  ...tokens});
        } catch (error) {
            if(error.message === 'INVALID_CREDENTIALS'){
                return res.status(401).json({message: "Email atau password salah."})
            }
            return res.status(500).json({message: "Terjadi kesalahan server."});
        }
    },

    async changePassword(req, res) {
        const validation = changePasswordSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                errors: validation.errorerrors.map(e => ({
                    field: e.path.join("."),
                    message: e.message,
                })),
            });
        }
        try{
            const result = await authService.changePassword({
                userId: req.user.userId,
                ...validation.data,   
            });
            return res.status(200).json(result);
        } catch (error) {
            if(error.message === 'INVALID_OLD_PASSWORD'){
                return res.status(401).json({message:'Password lama tidak sesuai.'});
            }
            return res.status(500).json({message: "Terjadi kesalahan server."});
        }
    },

    async refreshToken(req,res) {
        try {
            const { refreshToken } =req.body;
            const token = await authService.refreshToken(refreshToken);
            return res.status(200).json(token);
        } catch (error) {
            return res.status(401).json({
                message:error.message
            });
        }
    },

    async logout(req,res) {
        try {
            const result = await authService.logout(req.user.id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({message:error.message});
        }
    },
};

module.exports = authController;