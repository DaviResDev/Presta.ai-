import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { TopBar } from "./TopBar";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

interface DadosProfissionaisPageProps {
  onNavigate?: (page: string) => void;
}

interface Option {
  id: string;
  nome: string;
}

interface ServicoOption extends Option {
  area_id: string;
}

export function DadosProfissionaisPage({ onNavigate }: DadosProfissionaisPageProps) {
  const [formData, setFormData] = useState({
    areas_ids: [] as string[],
    servicos_ids: [] as string[],
    tempo_trabalho: "",
    cnpj_ctps_url: "",
  });
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Opções carregadas do banco
  const [areas, setAreas] = useState<Option[]>([]);
  const [servicos, setServicos] = useState<ServicoOption[]>([]);
  const [tempoTrabalhoOptions] = useState([
    "Menos de 1 ano",
    "1 a 3 anos",
    "3 a 5 anos",
    "5 a 10 anos",
    "Mais de 10 anos",
  ]);

  // Carregar opções do banco de dados
  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        console.log("Iniciando carregamento de opções...");

        // Tentar carregar áreas profissionais
        let areasData: Option[] = [];
        let areasLoaded = false;

        // Tentar primeiro com areas_profissionais
        const { data: data1, error: error1 } = await supabase
          .from("areas_profissionais")
          .select("id, nome")
          .order("nome");

        if (error1) {
          console.log("Tabela 'areas_profissionais' não encontrada, tentando 'areas'...", error1.message);
          // Se falhar, tentar com areas (nome antigo)
          const { data: data2, error: error2 } = await supabase
            .from("areas")
            .select("id, nome")
            .order("nome");

          if (error2) {
            console.error("Erro ao carregar áreas:", error2);
            toast.error(`Erro ao carregar áreas: ${error2.message}`);
          } else {
            areasData = data2 || [];
            areasLoaded = true;
            console.log(`✅ Áreas carregadas da tabela 'areas': ${areasData.length} registro(s)`);
          }
        } else {
          areasData = data1 || [];
          areasLoaded = true;
          console.log(`✅ Áreas carregadas da tabela 'areas_profissionais': ${areasData.length} registro(s)`);
        }

        setAreas(areasData);

        // Tentar carregar serviços prestados
        let servicosData: ServicoOption[] = [];

        // Tentar primeiro com servicos_prestados
        const { data: servicos1, error: servicosError1 } = await supabase
          .from("servicos_prestados")
          .select("id, nome, area_id")
          .order("nome");

        if (servicosError1) {
          console.log("Tabela 'servicos_prestados' não encontrada, tentando 'servicos'...", servicosError1.message);
          // Se falhar, tentar com servicos (nome antigo)
          const { data: servicos2, error: servicosError2 } = await supabase
            .from("servicos")
            .select("id, nome")
            .order("nome");

          if (servicosError2) {
            console.error("Erro ao carregar serviços:", servicosError2);
            toast.error(`Erro ao carregar serviços: ${servicosError2.message}`);
          } else {
            // Se a tabela servicos não tem area_id, criar objetos sem área
            servicosData = (servicos2 || []).map((s) => ({
              ...s,
              area_id: "", // Sem área vinculada
            }));
            console.log(`✅ Serviços carregados da tabela 'servicos': ${servicosData.length} registro(s) (sem área vinculada)`);
          }
        } else {
          servicosData = (servicos1 || []) as ServicoOption[];
          console.log(`✅ Serviços carregados da tabela 'servicos_prestados': ${servicosData.length} registro(s)`);
        }

        setServicos(servicosData);

        if (areasData.length === 0) {
          console.warn("⚠️ Nenhuma área encontrada no banco de dados");
          toast.warning("Nenhuma área cadastrada no sistema. Entre em contato com o administrador.");
        }

        if (servicosData.length === 0) {
          console.warn("⚠️ Nenhum serviço encontrado no banco de dados");
          toast.warning("Nenhum serviço cadastrado no sistema. Entre em contato com o administrador.");
        }
      } catch (error: any) {
        console.error("Erro geral ao carregar opções:", error);
        toast.error(`Erro ao carregar opções: ${error.message || "Erro desconhecido"}`);
        // Definir arrays vazios para evitar erros
        setAreas([]);
        setServicos([]);
      } finally {
        setLoadingOptions(false);
        console.log("Carregamento de opções finalizado");
      }
    };

    loadOptions();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: "areas_ids" | "servicos_ids", value: string) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        // Ao remover uma área, remover também os serviços dessa área
        if (field === "areas_ids") {
          const servicosDaArea = servicos
            .filter((s) => s.area_id === value)
            .map((s) => s.id);
          return {
            ...prev,
            [field]: current.filter((id) => id !== value),
            servicos_ids: prev.servicos_ids.filter((id) => !servicosDaArea.includes(id)),
          };
        }
        return { ...prev, [field]: current.filter((id) => id !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  // Filtrar serviços baseado nas áreas selecionadas
  // Se o serviço não tiver area_id (vindo da tabela servicos antiga), mostrar todos quando houver áreas selecionadas
  const servicosFiltrados =
    formData.areas_ids.length > 0
      ? servicos.filter((servico) => {
          // Se não tem area_id, mostrar todos (compatibilidade com tabela antiga)
          if (!servico.area_id || servico.area_id === "") {
            return true;
          }
          return formData.areas_ids.includes(servico.area_id);
        })
      : [];

  const handleSubmit = () => {
    // Validação básica - apenas verificar se preencheu os campos obrigatórios
    if (formData.areas_ids.length === 0 || formData.servicos_ids.length === 0) {
      toast.error("Por favor, selecione pelo menos uma Área e um Serviço Prestado");
      return;
    }

    // Salvar dados profissionais no sessionStorage
    const dadosProfissionais = {
      areas_ids: formData.areas_ids,
      servicos_ids: formData.servicos_ids,
      tempo_trabalho: formData.tempo_trabalho,
      cnpj_ctps_url: formData.cnpj_ctps_url,
    };

    sessionStorage.setItem("prestadorDadosProfissionais", JSON.stringify(dadosProfissionais));

    // Navegar para a próxima etapa (dados do perfil)
    onNavigate?.("cadastro-perfil");
  };


  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <TopBar activeLink="cadastro" onNavigate={onNavigate} />

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="flex items-center justify-center min-h-full px-4 sm:px-6 py-2">
          <div className="w-full max-w-[450px]">
          <div className="text-center mb-3">
            <h1 className="text-2xl mb-1">Cadastro Prestador de Serviço</h1>
            <h2 className="text-[#FF6B35] text-xl">Dados Profissional</h2>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            {loadingOptions ? (
              <div className="text-center py-4 text-sm">Carregando opções...</div>
            ) : (
              <div className="space-y-4">
                {/* Área */}
                <div>
                  <Label htmlFor="areas" className="text-gray-700 mb-1 block text-sm">
                    Área
                  </Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !formData.areas_ids.includes(value)) {
                        handleMultiSelect("areas_ids", value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full border-gray-200">
                      <SelectValue
                        placeholder={
                          formData.areas_ids.length > 0
                            ? formData.areas_ids
                                .map((id) => areas.find((a) => a.id === id)?.nome)
                                .filter(Boolean)
                                .join(", ")
                            : "Selecione as áreas"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem
                          key={area.id}
                          value={area.id}
                          disabled={formData.areas_ids.includes(area.id)}
                        >
                          {area.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Serviço Prestado */}
                <div>
                  <Label htmlFor="servicos" className="text-gray-700 mb-1 block text-sm">
                    Serviço Prestado
                  </Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !formData.servicos_ids.includes(value)) {
                        handleMultiSelect("servicos_ids", value);
                      }
                    }}
                    disabled={formData.areas_ids.length === 0}
                  >
                    <SelectTrigger className="w-full border-gray-200">
                      <SelectValue
                        placeholder={
                          formData.areas_ids.length === 0
                            ? "Selecione uma área primeiro"
                            : formData.servicos_ids.length > 0
                            ? formData.servicos_ids
                                .map((id) => servicosFiltrados.find((s) => s.id === id)?.nome)
                                .filter(Boolean)
                                .join(", ")
                            : "Selecione os serviços"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {servicosFiltrados.map((servico) => (
                        <SelectItem
                          key={servico.id}
                          value={servico.id}
                          disabled={formData.servicos_ids.includes(servico.id)}
                        >
                          {servico.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.areas_ids.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selecione pelo menos uma área para ver os serviços disponíveis
                    </p>
                  )}
                </div>

                {/* Tempo de Trabalho */}
                <div>
                  <Label htmlFor="tempo_trabalho" className="text-gray-700 mb-1 block text-sm">
                    Tempo de Trabalho
                  </Label>
                  <Select
                    value={formData.tempo_trabalho}
                    onValueChange={(value) => handleInputChange("tempo_trabalho", value)}
                  >
                    <SelectTrigger className="w-full border-gray-200">
                      <SelectValue placeholder="Selecione o tempo de trabalho" />
                    </SelectTrigger>
                    <SelectContent>
                      {tempoTrabalhoOptions.map((tempo) => (
                        <SelectItem key={tempo} value={tempo}>
                          {tempo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cartão CNPJ ou CTPS */}
                <div>
                  <Label htmlFor="cnpj_ctps" className="text-gray-700 mb-1 block text-sm">
                    Cartão CNPJ ou CTPS
                  </Label>
                  <Input
                    id="cnpj_ctps"
                    type="text"
                    placeholder="https://exemplo.com/cnpj.jpg"
                    className="w-full border-gray-200"
                    value={formData.cnpj_ctps_url}
                    onChange={(e) => handleInputChange("cnpj_ctps_url", e.target.value)}
                  />
                </div>

                {/* Botão Avançar */}
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-[#FF6B35] hover:bg-[#e55a28] text-white py-2.5 rounded-xl text-sm mt-3"
                >
                  Avançar
                </Button>
              </div>
            )}
          </div>
        </div>
        </div>
      </ScrollArea>
    </div>
  );
}

