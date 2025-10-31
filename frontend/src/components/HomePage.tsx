import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TopBar } from "./TopBar";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import ilustracaoImage from '../../comp/foto_familia.png';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [imageError, setImageError] = useState(false);
  
  const servicos = [
    "Eletricista",
    "Diarista",
    "Encanador",
    "Pintor",
    "Vidraceiro",
    "Pedreiro"
  ];


  const handleServicoClick = async (servicoNome: string) => {
    const prestadorId = sessionStorage.getItem("prestadorId");
    
    if (!prestadorId) {
      toast.info("Por favor, faça o cadastro como prestador primeiro");
      onNavigate?.("cadastro");
      return;
    }

    try {
      // Buscar ou criar o serviço na tabela servicos
      let servicoId: string;

      // Primeiro, verificar se o serviço já existe
      const { data: servicoExistente, error: buscaError } = await supabase
        .from("servicos")
        .select("id")
        .eq("nome", servicoNome)
        .single();

      if (servicoExistente) {
        servicoId = servicoExistente.id;
      } else {
        // Se não existir, criar o serviço
        const { data: novoServico, error: criaError } = await supabase
          .from("servicos")
          .insert([{ nome: servicoNome }])
          .select()
          .single();

        if (criaError) {
          throw criaError;
        }

        servicoId = novoServico.id;
      }

      // Verificar se a relação já existe
      const { data: relacaoExistente } = await supabase
        .from("prestador_servico")
        .select("id")
        .eq("prestador_id", prestadorId)
        .eq("servico_id", servicoId)
        .single();

      if (relacaoExistente) {
        toast.info(`${servicoNome} já está vinculado ao seu perfil`);
        return;
      }

      // Criar a relação prestador-serviço
      const { error: insertError } = await supabase
        .from("prestador_servico")
        .insert([
          {
            prestador_id: prestadorId,
            servico_id: servicoId,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      setServicosSelecionados((prev) => [...prev, servicoNome]);
      toast.success(`${servicoNome} adicionado aos seus serviços!`);
    } catch (error: any) {
      console.error("Erro ao salvar serviço:", error);
      toast.error("Erro ao salvar serviço. Tente novamente.");
    }
  };


  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <TopBar activeLink="inicio" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-12 px-20 py-12 max-w-[1400px] mx-auto flex-1 overflow-hidden">
        {/* Left Side */}
        <div className="flex flex-col justify-center overflow-hidden">
          <h1 className="text-5xl mb-8 leading-tight">
            Encontre o serviço<br />que você precisa aqui
          </h1>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Input
              type="text"
              placeholder="De qual serviço você precisa hoje?"
              className="pl-4 pr-12 py-6 border-2 border-gray-300 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Service Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {servicos.map((servico) => (
              <Button
                key={servico}
                variant="secondary"
                onClick={() => handleServicoClick(servico)}
                className={`rounded-xl py-3 transition ${
                  servicosSelecionados.includes(servico)
                    ? "bg-[#FF6B35] hover:bg-[#e55a28] text-white"
                    : "bg-[#C8D5B9] hover:bg-[#b8c5a9] text-gray-800"
                }`}
              >
                {servico}
              </Button>
            ))}
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="flex items-start justify-center h-full overflow-hidden pt-8">
          {imageError ? (
            <div className="w-full h-auto max-w-[350px] flex items-center justify-center bg-gray-100 rounded-lg p-8">
              <div className="text-center text-gray-400">
                <p className="text-lg mb-2">Imagem não disponível</p>
                <p className="text-sm">Ilustração temporariamente indisponível</p>
              </div>
            </div>
          ) : (
            <img 
              src={ilustracaoImage} 
              alt="Família com prestador de serviço - Ilustração mostrando uma família feliz com um profissional de serviços domésticos" 
              className="w-full h-auto max-w-[350px] object-contain drop-shadow-lg rounded-lg"
              onError={() => {
                setImageError(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
