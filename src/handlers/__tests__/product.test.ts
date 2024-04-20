import request from "supertest";
import server from "../../server";

describe("POST /api/products", () => {
  it("Should display validation errors", async () => {
    const res = await request(server).post("/api/products").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(4);

    expect(res.status).not.toBe(404);
    expect(res.body.errors).not.toHaveLength(2);
  });

  it("Should validate that the price is greater than 0", async () => {
    const res = await request(server).post("/api/products").send({
      name: "Monitor Curvo Test",
      price: 0,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);

    expect(res.status).not.toBe(404);
    expect(res.body.errors).not.toHaveLength(2);
  });

  it("Should validate that the price is a number and greater than 0", async () => {
    const res = await request(server).post("/api/products").send({
      name: "Monitor Curvo Test",
      price: "Hola",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(2);

    expect(res.status).not.toBe(404);
    expect(res.body.errors).not.toHaveLength(4);
  });

  it("Should create a product", async () => {
    const res = await request(server).post("/api/products").send({
      name: "Mouse testing",
      price: 500,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data");

    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("error");
  });
});

describe("GET /api/products", () => {
  it("Should check if /api/products url exists", async () => {
    const res = await request(server).get("/api/products");
    expect(res.status).not.toBe(404);
  });

  it("GET a JSON resnpose with products", async () => {
    const res = await request(server).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveLength(1);

    expect(res.status).not.toBe(401);
    expect(res.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/produtcs/:id", () => {
  it("Should return a 404 response for a non-existent product", async () => {
    const productId = 551561;
    const res = await request(server).get(`/api/products/${productId}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Producto no encontrado");
  });

  it("Should cheack a valid Id in the URL", async () => {
    const productId = 551561;
    const res = await request(server).get(`/api/products/not-valid-url`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("ID no valido");
  });

  it("Get a json response for a single product", async () => {
    const productId = 1;
    const res = await request(server).get(`/api/products/${productId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });
});

describe("PUT /api/products/:id", () => {
  it("Should cheack a valid Id in the URL", async () => {
    const res = await request(server).put(`/api/products/not-valid-url`).send({
      name: "Monitor",
      availability: true,
      price: 500,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("ID no valido");
  });

  it("Should display validation error messages when updating a product", async () => {
    const res = await request(server).put("/api/products/1").send({});

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeTruthy();
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(5);

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("Should validate that the price is greater than 0", async () => {
    const res = await request(server).put("/api/products/1").send({
      name: "Monitor",
      availability: true,
      price: 0,
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeTruthy();
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("Precio no valido");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("Should return a 404 response for a non-exintent product", async () => {
    const productId = 514561;
    const res = await request(server).put(`/api/products/${productId}`).send({
      name: "Monitor",
      availability: true,
      price: 500,
    });

    expect(res.status).toBe(404);
    // expect(res.body.errors).toBeTruthy();
    expect(res.body.error).toBe("Producto no encontrado");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("Should update an existing product with valid data", async () => {
    const res = await request(server).put(`/api/products/1`).send({
      name: "Monitor",
      availability: true,
      price: 500,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");

    expect(res.status).not.toBe(400);
    expect(res.body).not.toHaveProperty("errors");
  });
});

describe("PATCH /api/products/:id", () => {
  it("Should return a 404 response for a non-existent product", async () => {
    const productId = 556156;
    const res = await request(server).patch(`/api/products/${productId}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Producto no encontrado");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("Should uptade the product availability", async () => {
    const res = await request(server).patch(`/api/products/1`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.availability).toBe(false);

    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });
});

describe("DELETE /api/product/:id", () => {
  it("Should chack a valid Id", async () => {
    const res = await request(server).delete("/api/products/no-valid");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toBe("ID no valido");
  });

  it("Should return a 404 response for a non-existent product", async () => {
    const productId = 545656;
    const res = await request(server).delete(`/api/products/${productId}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Producto no encontrado");
    expect(res.status).not.toBe(200);
  });

  it("Should delete a product", async () => {
    const res = await request(server).delete("/api/products/1");
    expect(res.status).toBe(200);
    expect(res.body.data).toBe("Producto Eliminado");

    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
  });
});
