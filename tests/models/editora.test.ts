import { Editora } from "../../src/models/editora";
import { AppDataSource } from "../../src/db/dataSource";

beforeAll(async () => {
  await AppDataSource.initialize();
});
afterAll(async () => {
  await AppDataSource.destroy();
});

// Testa o modelo editora
describe.skip("Testando model editora", () => {
  const objetoEditora = {
    nome: "Vozes",
    cidade: "Petrópolis",
    email: "contato@vozes.com.br",
  };
  test("Deve instanciar uma nova editora", () => {
    const editora = new Editora(objetoEditora);
    expect(editora).toEqual(expect.objectContaining(objetoEditora));
  });

  let objId: number;
  test.skip("Deve salvar editora no db usando o then", () => {
    const editora = new Editora(objetoEditora);

    return editora.save().then((obj) => {
      objId = obj.id;
      expect(obj.nome).toBe("Vozes");
    });
  });

  test("Deve salvar editora no db usando async/await", async () => {
    const editora = new Editora(objetoEditora);

    const dados = await editora.save();
    objId = dados.id;
    expect(dados.nome).toBe("Vozes");
    expect(dados.id).toBeDefined();
  });

  test("Deve deletar registro a partir do id", async () => {
    const editora = await Editora.delete(objId);
    expect(editora.affected).toBe(1);
  });

  test.todo("Deve fazer uma chamada simulada ao db");
});
