import request from "supertest";
import { AppDataSource } from "../../src/db/dataSource";
import app from "../../src/app";

beforeAll(async () => {
  await AppDataSource.initialize();
});
afterAll(async () => {
  await AppDataSource.destroy();
});

describe.skip("Rotas de editora", () => {
  test("GET /editoras devolve status 200", async () => {
    const res = await request(app).get("/editoras");
    expect(res.status).toBe(200);
  });

  test.skip("GET /editoras retorna 7 elementos", async () => {
    const res = await request(app).get("/editoras");
    expect(res.body).toHaveLength(6);
  });

  test("GET /editoras/1 retorna a editora correta", async () => {
    const res = await request(app).get("/editoras/1");
    expect(res.body.nome).toBe("Europa-América");
  });

  test.todo("GET /editoras/:id/livros retorna os livros da editora");

  test("POST /editoras cria e retorna status 201", async () => {
    const res = await request(app).post("/editoras").send({
      nome: "Editora Senai",
      cidade: "Petrópolis",
      email: "editora@senai.com.br",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        nome: "Editora Senai",
        cidade: "Petrópolis",
        email: "editora@senai.com.br",
      }),
    );
  });

  test("PUT /editoras/14 atualiza e retorna 200", async () => {
    const res = await request(app).put("/editoras/14").send({
      cidade: "Rio de Janeiro",
    });

    expect(res.status).toBe(200);
    expect(res.body.cidade).toBe("Rio de Janeiro");
  });

  test.skip("DELETE /editoras/12 retorna 204", async () => {
    const res = await request(app).delete("/editoras/12");
    expect(res.status).toBe(204);
  });

  test("POST com body vazio NÃO cria/salva e retorna 400", async () => {
    const res = await request(app).post("/editoras").send({});

    expect(res.status).toBe(400);
  });
});
