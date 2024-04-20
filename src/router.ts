import { Router } from "express";
import { body, param } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { handleInputsError } from "./middleware";
const router = Router();

/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *               type: object
 *               properties:
 *                      id:
 *                          type: integer
 *                          description: Th product ID
 *                          example: 1
 *                      name:
 *                          type: string
 *                          description: Th product name
 *                          example: Monitor curvo 49 pulgadas
 *                      price:
 *                          type: number
 *                          description: Th product price
 *                          example: 350.50
 *                      availability:
 *                          type: boolean
 *                          description: Th product availability
 *                          example: true
 */
/**
 * @swagger
 * /api/products:
 *        get:
 *            summary: Get a list of products
 *            tags:
 *                - Products
 *            description: Return a list a products
 *            responses:
 *                   200:
 *                       description: Successful response
 *                       content:
 *                             application/json:
 *                                        schema:
 *                                            type: array
 *                                            items:
 *                                               $ref: '#components/schemas/Product'
 *
 *
 */

/**
 * @swagger
 * /api/products/{id}:
 *          get:
 *              summary: Get a product by ID
 *              tags:
 *                   - Products
 *              description: Return a product based on its unique ID
 *              parameters:
 *                      - in: path
 *                        name: id
 *                        description: The ID of the product to retrieve
 *                        required: true
 *                        schema:
 *                             type: integer
 *              responses:
 *                       200:
 *                          description: Successful response
 *                          content:
 *                                  application/json:
 *                                             schema:
 *                                                  $ref: '#components/schemas/Product'
 *                       404:
 *                          description: Not found
 *                       400:
 *                          description: Bad request
 */
/**
 * @swagger
 * /api/products:
 *      post:
 *        summary: Create a new product
 *        tags:
 *          - Products
 *        description: Return a new record in the database
 *        requestBody:
 *              required: true
 *              content:
 *                 application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                                name:
 *                                  type: string
 *                                  example: "Monitor Curvo 49 pulgadas"
 *                                price:
 *                                   type: number
 *                                   example: 550
 *        responses:
 *              201:
 *                description: Successful Reesponse
 *                content:
 *                     application/json:
 *                             schema:
 *                                 $ref: "#/components/schemas/Product"
 *              400:
 *                 description: Bad Request - invalid input data
 *
 *
 *
 */
/**
 * @swagger
 * /api/products/{id}:
 *      put:
 *        summary: Update a product with user input
 *        tags:
 *          - Products
 *        description: Returns the updated product
 *        parameters:
 *              - in: path
 *                name: id
 *                description: The ID of the product to retrieve
 *                required: true
 *                schema:
 *                     type: integer
 *        requestBody:
 *              required: true
 *              content:
 *                 application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                                name:
 *                                  type: string
 *                                  example: "Monitor Curvo 49 pulgadas"
 *                                price:
 *                                   type: number
 *                                   example: 550
 *                                availability:
 *                                   type: boolean
 *                                   example: true
 *        responses:
 *              200:
 *                description: Successful Reesponse
 *                content:
 *                     application/json:
 *                             schema:
 *                                 $ref: "#/components/schemas/Product"
 *              400:
 *                description: Bad Request - invalid ID or invalid input data
 *              404:
 *                description: Product Not found
 *
 */
/**
 * @swagger
 * /api/products/{id}:
 *        patch:
 *          summary: Update Product availability
 *          tags:
 *             - Products
 *          description: Returs tha updated availability
 *          parameters:
 *              - in: path
 *                name: id
 *                description: The ID of the product to retrieve
 *                required: true
 *                schema:
 *                     type: integer
 *          responses:
 *              200:
 *                description: Successful Reesponse
 *                content:
 *                     application/json:
 *                             schema:
 *                                 $ref: "#/components/schemas/Product"
 *              400:
 *                description: Bad Request - invalid ID
 *              404:
 *                description: Product Not found
 */
/**
 * @swagger
 * /api/products/{id}:
 *        delete:
 *           summary: Delete a product
 *           tags:
 *              - Products
 *           description: Delete a product by ID and return a meesage of successfully
 *           parameters:
 *              - in: path
 *                name: id
 *                description: The ID of the product to delete
 *                required: true
 *                schema:
 *                     type: integer
 *           responses:
 *                200:
 *                  description: Successful Response
 *                  content:
 *                      type: string
 *                      value: 'Producto Eliminado'
 *                400:
 *                  description: Bad Request
 *                404: Product Not Found
 *
 */
//Routing
router.get("/", getProducts);
router.get(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  handleInputsError,
  getProductById
);

router.post(
  "/",
  body("name")
    .notEmpty()
    .withMessage("El nombre del producto no puede ir vacio"),
  body("price")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio del producto no puede ir vacio")
    .custom((value) => value > 0)
    .withMessage("Precio no valido"),
  handleInputsError,
  createProduct
);

router.put(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  body("name")
    .notEmpty()
    .withMessage("El nombre del producto no puede ir vacio"),
  body("price")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio del producto no puede ir vacio")
    .custom((value) => value > 0)
    .withMessage("Precio no valido"),
  body("availability")
    .isBoolean()
    .withMessage("valor para disponibilidad no valido"),
  handleInputsError,
  updateProduct
);

router.patch(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  handleInputsError,
  updateAvailability
);

router.delete(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  handleInputsError,
  deleteProduct
);

export default router;
