import request from "supertest";
import app from "../../src/app";
import { resetarBanco, fecharBanco } from "../helpers/db";

beforeEach(async () => {
  await resetarBanco();
});

afterAll(async () => {
  await fecharBanco();
});

describe("Rotas de livros", () => {
  test("GET /livros → 200 e 5 livros", async () => {
    const res = await request(app).get("/livros");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
  });

  test("GET /livros/1 → 200 e titulo O Hobbit", async () => {
    const res = await request(app).get("/livros/1");
    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe("O Hobbit");
  });

  test("GET /livros/999 → 404", async () => {
    const res = await request(app).get("/livros/999");
    expect(res.status).toBe(404);
  });

  test("POST /livros válido → 201 com id", async () => {
    const res = await request(app).post("/livros").send({
      titulo: "Livro Novo",
      paginas: 123,
      autor_id: 1,
      editora_id: 2,
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({ id: expect.any(Number) }),
    );
  });

  test("POST /livros vazio → 400", async () => {
    const res = await request(app).post("/livros").send({});
    expect(res.status).toBe(400);
  });

  test("POST /livros com autor_id inexistente → 400", async () => {
    const res = await request(app).post("/livros").send({
      titulo: "X",
      paginas: 10,
      autor_id: 999,
      editora_id: 1,
    });
    expect(res.status).toBe(400);
  });

  test("POST /livros com editora_id inexistente → 400", async () => {
    const res = await request(app).post("/livros").send({
      titulo: "X",
      paginas: 10,
      autor_id: 1,
      editora_id: 999,
    });
    expect(res.status).toBe(400);
  });

  test("POST /livros com paginas = 0 → 400", async () => {
    const res = await request(app).post("/livros").send({
      titulo: "X",
      paginas: 0,
      autor_id: 1,
      editora_id: 1,
    });
    expect(res.status).toBe(400);
  });

  test("POST /livros com paginas negativas → 400", async () => {
    const res = await request(app).post("/livros").send({
      titulo: "X",
      paginas: -5,
      autor_id: 1,
      editora_id: 1,
    });
    expect(res.status).toBe(400);
  });

  test("PUT /livros/1 atualiza paginas → 200", async () => {
    const res = await request(app).put("/livros/1").send({ paginas: 999 });
    expect(res.status).toBe(200);
    expect(res.body.paginas).toBe(999);
  });

  test("PUT /livros/999 → 404", async () => {
    const res = await request(app).put("/livros/999").send({ paginas: 1 });
    expect(res.status).toBe(404);
  });

  test("DELETE /livros/5 → 204", async () => {
    const res = await request(app).delete("/livros/5");
    expect(res.status).toBe(204);
  });

  test("DELETE /livros/999 → 404", async () => {
    const res = await request(app).delete("/livros/999");
    expect(res.status).toBe(404);
  });

  test("GET /editoras/2/livros → lista da editora 2", async () => {
    const res = await request(app).get("/editoras/2/livros");
    expect(res.status).toBe(200);
    // Na semente, editora 2 tem 1 livro
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("POST /livros para editora 2 e GET /editoras/2/livros cresce em 1", async () => {
    const before = await request(app).get("/editoras/2/livros");
    const resPost = await request(app).post("/livros").send({
      titulo: "Novo da Editora 2",
      paginas: 200,
      autor_id: 1,
      editora_id: 2,
    });
    expect(resPost.status).toBe(201);
    const after = await request(app).get("/editoras/2/livros");
    expect(after.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ titulo: "Novo da Editora 2" }),
      ]),
    );
    expect(after.body.length).toBe(before.body.length + 1);
  });
});
