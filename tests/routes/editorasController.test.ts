import request from "supertest";
import { AppDataSource } from "../../src/db/dataSource";
import { Editora } from "../../src/models/editora";
import app from "../../src/app";

beforeAll(async () => {
  await AppDataSource.initialize();
});
afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Rotas de editora", () => {
  it("GET /editoras devolve status 200", async () => {
    const req = await request(app).get("/editoras");
    expect(req.status).toBe(200);
});

it("GET /editoras retorna 7 elementos", async () => {
    const req = await request(app).get("/editoras");
    expect(req.body).toHaveLength(7)
    
  });

  it("GET /editoras/:id retorna a editora correta");

  it.todo("GET /editoras/:id/livros retorna todos os livros da editora");
  it.todo("POST /editoras cria e retorna status 201");
  it.todo("PUT /editoras/:id atualiza e retorna 200");
  it.todo("DELETE /editoras/:id retorna 204");
});
