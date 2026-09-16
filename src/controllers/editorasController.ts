import type { Request, Response } from 'express';
import { AppDataSource } from '../db/dataSource';
import { Editora } from '../models/editora';
import { Livro } from '../models/livro';

const editoras = () => AppDataSource.getRepository(Editora);

export async function listarEditoras(_req: Request, res: Response): Promise<void> {
  res.json(await editoras().find({ order: { id: 'ASC' } }));
}

export async function mostrarEditora(req: Request, res: Response): Promise<void> {
  const editora = await editoras().findOneBy({ id: Number(req.params.id) });
  if (!editora) {
    res.status(404).json({ erro: 'Editora não encontrada' });
    return;
  }
  res.json(editora);
}

export async function criarEditora(req: Request, res: Response): Promise<void> {
  const dados = req.body as Partial<Editora>;
  if(!dados.nome || !dados.email || !dados.cidade) {
    res.status(400).json(
      {
        error: "Campos obrigatórios ausentes"
      }
    )
  }
  
  const editora = editoras().create(dados);
  await editoras().save(editora);
  res.status(201).json(editora);
}

export async function atualizarEditora(req: Request, res: Response): Promise<void> {
  const repo = editoras();
  const editora = await repo.findOneBy({ id: Number(req.params.id) });
  if (!editora) {
    res.status(404).json({ erro: 'Editora não encontrada' });
    return;
  }
  repo.merge(editora, req.body as Partial<Editora>);
  await repo.save(editora);
  res.json(editora);
}

export async function excluirEditora(req: Request, res: Response): Promise<void> {
  const resultado = await editoras().delete(Number(req.params.id));
  if (resultado.affected === 0) {
    res.status(404).json({ erro: 'Editora não encontrada' });
    return;
  }
  res.status(204).send();
}

export async function livrosDaEditora(req: Request, res: Response): Promise<void> {
  const livros = await AppDataSource.getRepository(Livro).findBy({
    editora_id: Number(req.params.id),
  });
  res.json(livros);
}
