import type { Request, Response } from "express";
import { AppDataSource } from "../db/dataSource";
import { Livro } from "../models/livro";
import { Autor } from "../models/autor";
import { Editora } from "../models/editora";

const livros = () => AppDataSource.getRepository(Livro);

export async function listarLivros(
  _req: Request,
  res: Response,
): Promise<void> {
  res.json(await livros().find({ order: { id: "ASC" } }));
}

export async function mostrarLivro(req: Request, res: Response): Promise<void> {
  const livro = await livros().findOneBy({ id: Number(req.params.id) });
  if (!livro) {
    res.status(404).json({ erro: "Livro não encontrado" });
    return;
  }
  res.json(livro);
}

export async function criarLivro(req: Request, res: Response): Promise<void> {
  const dados = req.body as Partial<Livro>;
  // Validações básicas
  if (
    !dados.titulo ||
    dados.paginas === undefined ||
    dados.autor_id === undefined ||
    dados.editora_id === undefined
  ) {
    res.status(400).json({ error: "Campos obrigatórios ausentes" });
    return;
  }
  if (typeof dados.paginas !== "number" || dados.paginas < 1) {
    res.status(400).json({ error: "Número de páginas inválido" });
    return;
  }

  // Verifica existência de autor e editora
  const autor = await AppDataSource.getRepository(Autor).findOneBy({
    id: Number(dados.autor_id),
  });
  if (!autor) {
    res.status(400).json({ error: "Autor não encontrado" });
    return;
  }
  const editora = await AppDataSource.getRepository(Editora).findOneBy({
    id: Number(dados.editora_id),
  });
  if (!editora) {
    res.status(400).json({ error: "Editora não encontrada" });
    return;
  }

  const livro = livros().create(dados);
  await livros().save(livro);
  res.status(201).json(livro);
}

export async function atualizarLivro(
  req: Request,
  res: Response,
): Promise<void> {
  const repo = livros();
  const livro = await repo.findOneBy({ id: Number(req.params.id) });
  if (!livro) {
    res.status(404).json({ erro: "Livro não encontrado" });
    return;
  }
  repo.merge(livro, req.body as Partial<Livro>);
  await repo.save(livro);
  res.json(livro);
}

export async function excluirLivro(req: Request, res: Response): Promise<void> {
  const resultado = await livros().delete(Number(req.params.id));
  if (resultado.affected === 0) {
    res.status(404).json({ erro: "Livro não encontrado" });
    return;
  }
  res.status(204).send();
}
