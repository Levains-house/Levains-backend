const swaggerAutogen = require("swagger-autogen");
const path = require("path");

const docs = {
    info: {
        title: "르방이들 API 문서",
        description: "르방이들 프로젝트 API 명세서 입니다.",
        version: "1.0.0",
        license: "MIT"
    },
    host: "localhost:3001",
    schemas: ["http"]
};

const outputFile = "./auto-swagger-output.json";
const endPointFiles = [path.join(__dirname, "../app.ts")];

swaggerAutogen(outputFile, endPointFiles, docs);