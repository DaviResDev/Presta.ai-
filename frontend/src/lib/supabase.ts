import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas. Verifique o arquivo .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do banco de dados
export interface Usuario {
  id?: string;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  email: string;
  senha?: string; // Não armazenar senha em texto, usar auth do Supabase
  created_at?: string;
  updated_at?: string;
}

export interface Prestador {
  id?: string;
  nome: string;
  sobrenome: string;
  documento: string; // CNPJ ou CPF
  genero?: string;
  rg_url?: string;
  email?: string;
  senha?: string; // Não armazenar senha em texto, usar auth do Supabase
  created_at?: string;
  updated_at?: string;
}

export interface Servico {
  id?: string;
  nome: string;
  descricao?: string;
  created_at?: string;
}

export interface Area {
  id?: string;
  nome: string;
  descricao?: string;
  created_at?: string;
}

export interface PrestadorServico {
  id?: string;
  prestador_id: string;
  servico_id: string;
  created_at?: string;
}

export interface PrestadorArea {
  id?: string;
  prestador_id: string;
  area_id: string;
  created_at?: string;
}

