const prisma = require('../config/prisma');

const userRepository = {
    async findByEmail(email){
        return prisma.user.findUnique({where:{email}});
    },

    async findById(id){
        return prisma.user.findUnique({where:{id}});
    },

    async create(data){
        return prisma.user.create({data});
    },

    async update(id,data){
        return prisma.user.update({where:{id},data});
    },

    async findByRefreshToken(refreshToken){
        return prisma.user.findFirst({where:{refreshToken}})
    },
};

module.exports = userRepository;