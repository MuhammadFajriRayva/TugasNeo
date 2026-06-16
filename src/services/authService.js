const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const authService = {
    async register({email,password,role}) {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("EMAIL_ALREADY_EXISTS");
        }

        if (role === 'ADMIN'){
            throw new Error('FORBIDDEN_ROLE');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await userRepository.create({email,password: hashedPassword,role: role || 'USER',});

        return {id: newUser.id, email: newUser.email, role: newUser.role};
    },

    async login({email, password}) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if (!isPasswordValid) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const accessToken = jwt.sign(
            {userId: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '15m'}
        );

        const refreshToken = jwt.sign(
            {userId: user.id},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"}
        );

        await userRepository.update(user.id, {refreshToken});
        return {accessToken,refreshToken};
    },

    async changePassword({userId,oldPassword,newPassword}) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        const isValid = await bcrypt.compare(oldPassword,user.password);
        if (!isValid) {
            throw new Error("INVALID_OLD_PASSWORD");
        }

        const hashedNew = await bcrypt.hash(newPassword, 12);
        await userRepository.update(userId, {password: hashedNew});
        return {message: "Password berhasil diubah."};
    },

    async refreshToken(refreshToken){
        if (!refreshToken) {
            throw new Error("Refresh token diperlukan");
        }
        let decoded;

        try {
            decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );
        } catch (error) {
            throw new Error("Refresh token tidak valid");
        }
        const user = await userRepository.findByRefreshToken(refreshToken);
        if (!user) {
            throw new Error("Refresh token tidak ditemukan");
        }

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,{
                expiresIn: "15m"
            }
        );
        return {accessToken};
    },

    async logout(userId) {
        await userRepository.update(userId,{
            refreshToken: null
        });
        return {message:"Logout berhasil"};
    },
   
}

module.exports = authService;