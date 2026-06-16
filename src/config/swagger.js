const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Buku API",
            version: "1.0.0",
            description: "Dokumentasi API Aplikasi Manajemen Buku",
        },
        servers: [{url: `http://localhost:${process.env.PORT || 3000}`,},],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    // Lokasi file route yang berisi komentar @swagger
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve,
    swaggerUi.setup(swaggerSpec));
    console.log(`📖 Swagger UI: http://localhost:${process.env.PORT || 3000}/api-docs`);
};

module.exports = { setupSwagger };