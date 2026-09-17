import request from "supertest";
import app from "../../src/app";
import { resetarBanco, fecharBanco } from "../helpers/db";

beforeEach(async () => {
  await resetarBanco();
});

afterAll(async () => {
  await fecharBanco();
});

describe.skip("Rotas de autores", () => {
  test("GET /autores → 200 e 3 autores", async () => {
    const res = await request(app).get("/autores");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  test("GET /autores/1 → 200 e nome JRR Tolkien", async () => {
    const res = await request(app).get("/autores/1");
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe("JRR Tolkien");
  });

  test("GET /autores/999 → 404", async () => {
    const res = await request(app).get("/autores/999");
    expect(res.status).toBe(404);
  });

  test("POST /autores válido → 201 com id", async () => {
    const res = await request(app).post("/autores").send({
      nome: "Autor Teste",
      nacionalidade: "brasileira",
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({ id: expect.any(Number) }),
    );
  });

  test("POST /autores vazio → 400", async () => {
    const res = await request(app).post("/autores").send({});
    expect(res.status).toBe(400);
  });

  test("PUT /autores/1 atualiza nacionalidade → 200 com nova nacionalidade", async () => {
    const res = await request(app)
      .put("/autores/1")
      .send({ nacionalidade: "inglesa" });
    expect(res.status).toBe(200);
    expect(res.body.nacionalidade).toBe("inglesa");
  });

  test("PUT /autores/999 → 404", async () => {
    const res = await request(app)
      .put("/autores/999")
      .send({ nacionalidade: "x" });
    expect(res.status).toBe(404);
  });

  test("DELETE /autores/3 → 204", async () => {
    const res = await request(app).delete("/autores/3");
    expect(res.status).toBe(204);
  });

  test("DELETE /autores/999 → 404", async () => {
    const res = await request(app).delete("/autores/999");
    expect(res.status).toBe(404);
  });

  test("GET /autores/1/livros → 2 livros", async () => {
    const res = await request(app).get("/autores/1/livros");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test("GET /autores/3/livros → 1 livro", async () => {
    const res = await request(app).get("/autores/3/livros");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});
