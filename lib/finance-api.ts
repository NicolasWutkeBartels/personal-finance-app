import { invoke } from "@tauri-apps/api/core";

import type {
  Categoria,
  CategoriaAtualizar,
  CategoriaCriar,
  Despesa,
  DespesaAtualizar,
  DespesaCriar,
  DespesaTipo,
  Recorrente,
  RecorrenteAtualizar,
  RecorrenteCriar,
  Usuario,
  UsuarioAtualizar,
} from "@/lib/finance-demo";

export const financeApi = {
  obterUsuarioAdmin: () => invoke<Usuario>("obter_usuario_admin"),
  atualizarUsuarioAdmin: (input: UsuarioAtualizar) =>
    invoke<Usuario>("atualizar_usuario_admin", { input }),
  listarTiposDespesa: () => invoke<DespesaTipo[]>("listar_tipos_despesa"),
  listarCategorias: () => invoke<Categoria[]>("listar_categorias"),
  criarCategoria: (input: CategoriaCriar) =>
    invoke<Categoria>("criar_categoria", { input }),
  atualizarCategoria: (input: CategoriaAtualizar) =>
    invoke<Categoria>("atualizar_categoria", { input }),
  excluirCategoria: (cat_uuid: string) =>
    invoke<void>("excluir_categoria", { cat_uuid }),
  listarDespesas: () => invoke<Despesa[]>("listar_despesas"),
  criarDespesa: (input: DespesaCriar) => invoke<Despesa>("criar_despesa", { input }),
  atualizarDespesa: (input: DespesaAtualizar) =>
    invoke<Despesa>("atualizar_despesa", { input }),
  excluirDespesa: (des_uuid: string) => invoke<void>("excluir_despesa", { des_uuid }),
  listarRecorrentes: () => invoke<Recorrente[]>("listar_recorrentes"),
  criarRecorrente: (input: RecorrenteCriar) =>
    invoke<Recorrente>("criar_recorrente", { input }),
  atualizarRecorrente: (input: RecorrenteAtualizar) =>
    invoke<Recorrente>("atualizar_recorrente", { input }),
  ativarRecorrente: (rec_uuid: string) => invoke<void>("ativar_recorrente", { rec_uuid }),
  inativarRecorrente: (rec_uuid: string) => invoke<void>("inativar_recorrente", { rec_uuid }),
  excluirRecorrente: (rec_uuid: string) => invoke<void>("excluir_recorrente", { rec_uuid }),
};
