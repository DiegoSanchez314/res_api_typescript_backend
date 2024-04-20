import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.2",
    tags: [
      {
        name: "products",
        description: "API operations related to products",
      },
    ],
    info: {
      title: "REST API Node.js / Express / Typeescript",
      version: "1.0.0",
      description: "API docs for products",
    },
  },
  apis: ["./src/router.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerUIOptions: SwaggerUiOptions = {
  customSiteTitle: "Documentacion REST API Express / TypeScript",
};

export default swaggerSpec;
