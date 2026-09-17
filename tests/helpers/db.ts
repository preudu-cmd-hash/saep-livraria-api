import { AppDataSource } from "../../src/db/dataSource";
import { limpar, semear } from "../../src/db/seed";

/** Garante o banco conectado, zera as tabelas e recoloca a semente. Use no beforeEach. */
export async function resetarBanco(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  await limpar();
  await semear();
}

/** Fecha a conexão pro Jest encerrar sem "open handles". Use no afterAll. */
export async function fecharBanco(): Promise<void> {
  if (AppDataSource.isInitialized) {
    try {
      await AppDataSource.destroy();
    } catch (err: any) {
      if (
        err &&
        typeof err.message === "string" &&
        err.message.includes("Called end on pool more than once")
      ) {
        return;
      }
      throw err;
    }
  }
}
