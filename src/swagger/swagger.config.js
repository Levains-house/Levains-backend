const swaggerAutogen = require("swagger-autogen");
const path = require("path");

const docs = {
    info: {
        title: "멘도롱주멍 API 문서",
        description: "멘도롱주멍 서비스 API 명세서 입니다.",
        version: "1.0.0",
        license: "MIT"
    },
    host: "https://{domain}.com",
    schemas: ["https"]
};

const outputFile = "./auto-swagger-output.json";
const endPointFiles = [path.join(__dirname, "../app.ts")];

swaggerAutogen(outputFile, endPointFiles, docs);