import type { Request, Response } from 'express';
import { AppDataSource } from '../db/dataSource';
import { Autor } from '../models/autor';
import { Livro } from '../models/livro';

const autores = () => AppDataSource.getRepository(Autor);

export async function listarAutores(_req: Request, res: Response): Promise<void> {
  res.json(await autores().find({ order: { id: 'ASC' } }));
}

export async function mostrarAutor(req: Request, res: Response): Promise<void> {
  const autor = await autores().findOneBy({ id: Number(req.params.id) });
  if (!autor) {
    res.status(404).json({ erro: 'Autor não encontrado' });
    return;
  }
  res.json(autor);
}

export async function criarAutor(req: Request, res: Response): Promise<void> {
  const dados = req.body as Partial<Autor>;
  if (!dados.nome || !dados.nacionalidade) {
    res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    return;
  }
  const autor = autores().create(dados);
  await autores().save(autor);
  res.status(201).json(autor);
}

export async function atualizarAutor(req: Request, res: Response): Promise<void> {
  const repo = autores();
  const autor = await repo.findOneBy({ id: Number(req.params.id) });
  if (!autor) {
    res.status(404).json({ erro: 'Autor não encontrado' });
    return;
  }
  repo.merge(autor, req.body as Partial<Autor>);
  await repo.save(autor);
  res.json(autor);
}

export async function excluirAutor(req: Request, res: Response): Promise<void> {
  const resultado = await autores().delete(Number(req.params.id));
  if (resultado.affected === 0) {
    res.status(404).json({ erro: 'Autor não encontrado' });
    return;
  }
  res.status(204).send();
}

export async function livrosDoAutor(req: Request, res: Response): Promise<void> {
  const livros = await AppDataSource.getRepository(Livro).findBy({
    autor_id: Number(req.params.id),
  });
  res.json(livros);
}
