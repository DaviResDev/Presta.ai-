import { useState, useEffect } from "react";
import { Search, MessageSquare, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import ilustracaoImage from '../../comp/foto_familia.png';
import logoImage from '../../comp/logo.png';

interface ConcluidoPageProps {
  onNavigate?: (page: string) => void;
}

export function ConcluidoPage({ onNavigate }: ConcluidoPageProps) {
  const [loading, setLoading] = useState(false);
  const [dadosCompletos, setDadosCompletos] = useState(false);

  useEffect(() => {
    // Verificar se todos os dados estão no sessionStorage
    const dadosPessoais = sessionStorage.getItem("prestadorDadosPessoais");
    const dadosProfissionais = sessionStorage.getItem("prestadorDadosProfissionais");
    const dadosPerfil = sessionStorage.getItem("prestadorDadosPerfil");

    if (dadosPessoais && dadosProfissionais && dadosPerfil) {
      setDadosCompletos(true);
    }
  }, []);

  const handleFinalizarCadastro = async () => {
    // Recuperar todos os dados do sessionStorage
    const dadosPessoaisStr = sessionStorage.getItem("prestadorDadosPessoais");
    const dadosProfissionaisStr = sessionStorage.getItem("prestadorDadosProfissionais");
    const dadosPerfilStr = sessionStorage.getItem("prestadorDadosPerfil");

    if (!dadosPessoaisStr || !dadosProfissionaisStr || !dadosPerfilStr) {
      toast.error("Dados incompletos. Por favor, complete todas as etapas do cadastro.");
      return;
    }

    setLoading(true);

    try {
      const dadosPessoais = JSON.parse(dadosPessoaisStr);
      const dadosProfissionais = JSON.parse(dadosProfissionaisStr);
      const dadosPerfil = JSON.parse(dadosPerfilStr);

      // 1. Criar usuário no Auth do Supabase
      let authUserId: string | null = null;
      if (dadosPessoais.email && dadosPessoais.senha) {
        const emailCandidato = String(dadosPessoais.email).trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailParaAuth = emailRegex.test(emailCandidato)
          ? emailCandidato
          : `prestador_${dadosPessoais.documento}@presta.ai`;

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: emailParaAuth,
          password: dadosPessoais.senha,
        });

        if (authError) {
          const msg = authError.message?.toLowerCase?.() || "";
          if (msg.includes("for security purposes") || msg.includes("too many requests") || msg.includes("429")) {
            toast.error("Muitas tentativas. Aguarde alguns segundos e tente novamente.");
            setLoading(false);
            return;
          }
          // Se o email original for inválido mas o fallback já foi usado e ainda assim falhou por 'already registered', continuar
          if (msg.includes('user already registered')) {
            // continuar fluxo sem interromper
          } else if (msg.includes('email address') && msg.includes('is invalid')) {
            // Tentar com fallback se ainda não tentamos
            if (emailParaAuth === emailCandidato) {
              const { data: authData2, error: authError2 } = await supabase.auth.signUp({
                email: `prestador_${dadosPessoais.documento}@presta.ai`,
                password: dadosPessoais.senha,
              });
              if (authError2 && !String(authError2.message).toLowerCase().includes('user already registered')) {
                throw authError2;
              }
              if (authData2?.user) authUserId = authData2.user.id;
            } else {
              // já tentamos fallback
              throw authError;
            }
          } else {
            throw authError;
          }
        }

        if (authData?.user) {
          authUserId = authData.user.id;
        }
      }

      // 2. Criar usuário na tabela usuarios
      const dadosUsuario: any = {
        nome_completo: `${dadosPessoais.nome} ${dadosPessoais.sobrenome}`,
        cpf: dadosPessoais.documento,
        data_nascimento: dadosPessoais.data_nascimento || '1900-01-01',
        email: (dadosPessoais.email || `prestador_${dadosPessoais.documento}@presta.ai`).toLowerCase().trim(),
      };

      let usuarioData: any = null;
      const { data: usuarioInsertData, error: usuarioError } = await supabase
        .from("usuarios")
        .insert([dadosUsuario])
        .select()
        .single();

      if (usuarioError) {
        // Se der erro de duplicata, buscar usuário existente apenas por CPF
        if (usuarioError.code === '23505' || usuarioError.message.includes('duplicate')) {
          const { data: usuarioExistente, error: buscaError } = await supabase
            .from("usuarios")
            .select("id")
            .eq("cpf", dadosPessoais.documento)
            .maybeSingle();

          if (!buscaError && usuarioExistente) {
            usuarioData = usuarioExistente;
          } else {
            throw new Error("Usuário já cadastrado. Por favor, faça login ou use outro CPF/email.");
          }
        } else {
          throw usuarioError;
        }
      } else {
        usuarioData = usuarioInsertData;
      }

      // Helpers de normalização
      const normalizeUrl = (url?: string | null) => {
        if (!url) return null;
        const trimmed = String(url).trim();
        if (!trimmed) return null;
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        return `https://${trimmed}`;
      };

      const normalizeLinkedin = (link?: string | null) => {
        if (!link) return null;
        let v = String(link).trim();
        if (!v) return null;
        if (v.startsWith('http')) return v;
        if (v.includes('linkedin.com')) return `https://${v}`;
        // se for só username
        return `https://linkedin.com/in/${v.replace(/^@/, '')}`;
      };

      const normalizeHandle = (handle?: string | null) => {
        if (!handle) return null;
        let v = String(handle).trim();
        if (!v) return null;
        // se parecer URL, padronizar
        if (v.startsWith('http')) return v;
        // garantir @ no início para handle simples
        if (!v.startsWith('@')) v = `@${v}`;
        return v;
      };

      const normalizePhoneDigits = (phone?: string | null) => {
        if (!phone) return null;
        const digits = String(phone).replace(/\D+/g, '');
        return digits || null;
      };

      const normalizeEmail = (email?: string | null) => {
        if (!email) return null;
        const v = String(email).trim().toLowerCase();
        return v || null;
      };

      // 3. Criar prestador na tabela prestadores
      let dadosCompletosPrestador: any = {
        usuario_id: usuarioData.id,
        nome: dadosPessoais.nome,
        sobrenome: dadosPessoais.sobrenome,
        documento: dadosPessoais.documento,
        genero: dadosPessoais.genero || null,
        rg_url: normalizeUrl(dadosPessoais.rg_url) || null,
        tempo_trabalho: dadosProfissionais.tempo_trabalho || null,
        nickname: dadosPerfil.nickname?.trim() || null,
        foto_perfil_url: normalizeUrl(dadosPerfil.foto_url) || null,
        bio: dadosPerfil.descricao || null,
        rede_social: normalizeHandle(dadosPerfil.rede_social),
        linkedin: normalizeLinkedin(dadosPerfil.linkedin),
        disponibilidade: dadosPerfil.disponibilidade || null,
        idiomas: dadosPerfil.idiomas || null,
        telefone: normalizePhoneDigits(dadosPerfil.telefone),
      };

      // Adicionar email se fornecido
      const emailProf = normalizeEmail(dadosPerfil.email_profissional) || normalizeEmail(dadosPessoais.email);
      if (emailProf) {
        dadosCompletosPrestador.email = emailProf;
        dadosCompletosPrestador.email_profissional = normalizeEmail(dadosPerfil.email_profissional) || null;
      }

      let prestadorData: any = null;
      let prestadorId: string | number | null = null;

      // Tentar inserir prestador (tentar diferentes nomes de coluna)
      const { data: prestadorData1, error: insertError1 } = await supabase
        .from("prestadores")
        .insert([dadosCompletosPrestador])
        .select()
        .single();

      if (insertError1) {
        const errorMsg = insertError1.message.toLowerCase();
        
        if (errorMsg.includes("documento") || errorMsg.includes("cpf") || errorMsg.includes("cnpj")) {
          // Tentar com cpf_cnpj
          const dadosComCPF: any = {
            ...dadosCompletosPrestador,
            cpf_cnpj: dadosPessoais.documento,
          };
          delete dadosComCPF.documento;

          const { data: prestadorData2, error: insertError2 } = await supabase
            .from("prestadores")
            .insert([dadosComCPF])
            .select()
            .single();

          if (insertError2) {
            throw insertError2;
          }
          prestadorData = prestadorData2;
        } else {
          throw insertError1;
        }
      } else {
        prestadorData = prestadorData1;
      }

      if (!prestadorData || !prestadorData.id) {
        throw new Error("Erro ao obter ID do prestador criado");
      }

      prestadorId = prestadorData.id;

      // 4. Salvar áreas do prestador
      if (dadosProfissionais.areas_ids && dadosProfissionais.areas_ids.length > 0) {
        const areasData = dadosProfissionais.areas_ids.map((area_id: string) => ({
          prestador_id: prestadorId,
          area_id,
        }));

        const { error: areasError } = await supabase.from("prestador_areas").insert(areasData);
        if (areasError && !areasError.message.includes("duplicate")) {
          // Tentar com nome alternativo
          await supabase.from("prestador_area").insert(areasData);
        }
      }

      // 5. Salvar serviços do prestador
      if (dadosProfissionais.servicos_ids && dadosProfissionais.servicos_ids.length > 0) {
        const servicosData = dadosProfissionais.servicos_ids.map((servico_id: string) => ({
          prestador_id: prestadorId,
          servico_id,
        }));

        const { error: servicosError } = await supabase.from("prestador_servicos").insert(servicosData);
        if (servicosError && !servicosError.message.includes("duplicate")) {
          // Tentar com nome alternativo
          await supabase.from("prestador_servico").insert(servicosData);
        }
      }

      // 6. Salvar arquivos (CNPJ/CTPS e Galeria) - formatar URLs antes de salvar
      const arquivosParaSalvar = [];

      if (dadosProfissionais.cnpj_ctps_url) {
        arquivosParaSalvar.push({
          prestador_id: prestadorId,
          tipo_arquivo: "Cartão CNPJ",
          url: normalizeUrl(dadosProfissionais.cnpj_ctps_url),
        });
      }

      if (dadosPerfil.galeria_1) {
        arquivosParaSalvar.push({
          prestador_id: prestadorId,
          tipo_arquivo: "Galeria",
          url: normalizeUrl(dadosPerfil.galeria_1),
        });
      }

      if (dadosPerfil.galeria_2) {
        arquivosParaSalvar.push({
          prestador_id: prestadorId,
          tipo_arquivo: "Galeria",
          url: normalizeUrl(dadosPerfil.galeria_2),
        });
      }

      if (arquivosParaSalvar.length > 0) {
        const { error: arquivosError } = await supabase.from("arquivos_prestador").insert(arquivosParaSalvar);
        if (arquivosError && !arquivosError.message.includes("duplicate")) {
          console.warn("Erro ao salvar arquivos:", arquivosError);
        }
      }

      // 7. Limpar dados temporários do sessionStorage
      sessionStorage.removeItem("prestadorDadosPessoais");
      sessionStorage.removeItem("prestadorDadosProfissionais");
      sessionStorage.removeItem("prestadorDadosPerfil");

      toast.success("Cadastro realizado com sucesso!");
      setDadosCompletos(false);
    } catch (error: any) {
      console.error("Erro ao finalizar cadastro:", error);
      toast.error(`Erro ao finalizar cadastro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Header diferente */}
      <header className="px-8 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate?.("inicio")}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <img 
                src={logoImage} 
                alt="presta.ai logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-[#FF6B35] text-xl">presta.ai</span>
            </button>

            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar"
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg w-60"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <nav className="flex items-center gap-6">
                <button className="text-sm text-gray-700 hover:text-[#FF6B35] transition">
                  Início
                </button>
                <button className="text-sm text-gray-700 hover:text-[#FF6B35] transition">
                  Encontre Projetos
                </button>
                <button className="text-sm text-gray-700 hover:text-[#FF6B35] transition">
                  Configuração
                </button>
                <button className="text-gray-700 hover:text-[#FF6B35] transition">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="text-gray-700 hover:text-[#FF6B35] transition">
                  <User className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-8 px-12 py-8 max-w-[1400px] mx-auto flex-1 overflow-hidden">
        {/* Left Side - Text */}
        <div className="flex flex-col justify-center">
          {dadosCompletos ? (
            <>
              <h1 className="text-4xl mb-3 leading-tight">
                Revise seus Dados
              </h1>
              <h2 className="text-[#FF6B35] text-2xl mb-4">
                Finalize seu Cadastro
              </h2>
              <p className="text-gray-600 text-base mb-6">
                Confira todas as informações antes de finalizar. Todos os dados serão salvos após clicar no botão abaixo.
              </p>
              <Button
                onClick={handleFinalizarCadastro}
                disabled={loading}
                className="w-full max-w-md bg-[#FF6B35] hover:bg-[#e55a28] text-white py-3 rounded-xl text-lg disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Finalizar Cadastro"}
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-4xl mb-3 leading-tight">
                Enviado com Sucesso
              </h1>
              <h2 className="text-[#FF6B35] text-2xl mb-4">
                Seus dados estão sendo avaliados
              </h2>
              <p className="text-gray-600 text-base">
                Em até 15 dias úteis enviaremos o e-mail de confirmação
              </p>
            </>
          )}
        </div>

        {/* Right Side - Illustration */}
        <div className="flex items-center justify-center h-full overflow-hidden">
          <img 
            src={ilustracaoImage} 
            alt="Família com prestador de serviço" 
            className="w-full h-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
