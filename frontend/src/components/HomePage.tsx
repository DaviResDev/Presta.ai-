import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TopBar } from "./TopBar";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import ilustracaoImage from '../assets/3b40a813ed906783e5a76ae22be0e454ba009feb.png';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  
  const servicos = [
    "Eletricista",
    "Diarista",
    "Encanador",
    "Pintor",
    "Vidraceiro",
    "Pedreiro"
  ];

  const areas = [
    "Residencial",
    "Comercial",
    "Industrial",
    "Outras"
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

  const handleAreaClick = async (areaNome: string) => {
    const prestadorId = sessionStorage.getItem("prestadorId");
    
    if (!prestadorId) {
      toast.info("Por favor, faça o cadastro como prestador primeiro");
      onNavigate?.("cadastro");
      return;
    }

    try {
      // Buscar ou criar a área na tabela areas
      let areaId: string;

      // Primeiro, verificar se a área já existe
      const { data: areaExistente, error: buscaError } = await supabase
        .from("areas")
        .select("id")
        .eq("nome", areaNome)
        .single();

      if (areaExistente) {
        areaId = areaExistente.id;
      } else {
        // Se não existir, criar a área
        const { data: novaArea, error: criaError } = await supabase
          .from("areas")
          .insert([{ nome: areaNome }])
          .select()
          .single();

        if (criaError) {
          throw criaError;
        }

        areaId = novaArea.id;
      }

      // Verificar se a relação já existe
      const { data: relacaoExistente } = await supabase
        .from("prestador_area")
        .select("id")
        .eq("prestador_id", prestadorId)
        .eq("area_id", areaId)
        .single();

      if (relacaoExistente) {
        toast.info(`${areaNome} já está vinculada ao seu perfil`);
        return;
      }

      // Criar a relação prestador-área
      const { error: insertError } = await supabase
        .from("prestador_area")
        .insert([
          {
            prestador_id: prestadorId,
            area_id: areaId,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      toast.success(`Área ${areaNome} adicionada ao seu perfil!`);
    } catch (error: any) {
      console.error("Erro ao salvar área:", error);
      toast.error("Erro ao salvar área. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBar activeLink="inicio" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-12 px-20 py-20 max-w-[1400px] mx-auto">
        {/* Left Side */}
        <div className="flex flex-col justify-center">
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

          {/* Áreas de Atuação */}
          <div className="mt-6">
            <h3 className="text-xl mb-3 text-gray-700">Áreas de Atuação</h3>
            <div className="grid grid-cols-2 gap-3">
              {areas.map((area) => (
                <Button
                  key={area}
                  variant="outline"
                  onClick={() => handleAreaClick(area)}
                  className="rounded-xl py-2 border-2 hover:border-[#FF6B35] hover:text-[#FF6B35]"
                >
                  {area}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="flex items-center justify-center h-full">
          <img 
            src={ilustracaoImage} 
            alt="Família com prestador de serviço - Ilustração mostrando uma família feliz com um profissional de serviços domésticos" 
            className="w-full h-auto max-w-[500px] object-contain drop-shadow-lg rounded-lg"
            onError={(e) => {
              console.error('Erro ao carregar imagem:', e);
            }}
          />
        </div>
      </div>
    </div>
  );
}
