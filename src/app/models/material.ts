export type MaterialStatus = 'aprovado' | 'reprovado';

export interface MaterialRecord {
  id: string;
  codigo: string;
  descricao: string;
  fabricante: string;
  marca: string;
  data: string;
  local: string;
  status: MaterialStatus;
  parecer: string;
}

export type MaterialPayload = Omit<MaterialRecord, 'id'>;
