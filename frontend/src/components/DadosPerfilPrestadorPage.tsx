import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { TopBar } from "./TopBar";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

interface DadosPerfilPrestadorPageProps {
  onNavigate?: (page: string) => void;
}

export function DadosPerfilPrestadorPage({ onNavigate }: DadosPerfilPrestadorPageProps) {
  const [formData, setFormData] = useState({
    nickname: "",
    foto_url: "",
    descricao: "",
    galeria_1: "",
    galeria_2: "",
    rede_social: "",
    linkedin: "",
    disponibilidade: [] as string[],
    idiomas: [] as string[],
    telefone: "",
    email_profissional: "",
  });

  const [validatingNickname, setValidatingNickname] = useState(false);
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [telefoneError, setTelefoneError] = useState("");

  // Opções de disponibilidade inteligentes (como WhatsApp)
  const disponibilidadeOptions = [
    { value: "seg-sex-08-18", label: "Segunda a Sexta, 08:00 às 18:00" },
    { value: "seg-sex-09-17", label: "Segunda a Sexta, 09:00 às 17:00" },
    { value: "seg-sex-07-19", label: "Segunda a Sexta, 07:00 às 19:00" },
    { value: "seg-sab-08-18", label: "Segunda a Sábado, 08:00 às 18:00" },
    { value: "seg-sab-09-17", label: "Segunda a Sábado, 09:00 às 17:00" },
    { value: "sab-dom-09-13", label: "Sábado e Domingo, 09:00 às 13:00" },
    { value: "sab-dom-08-12", label: "Sábado e Domingo, 08:00 às 12:00" },
    { value: "todos-dias-08-18", label: "Todos os dias, 08:00 às 18:00" },
    { value: "todos-dias-09-17", label: "Todos os dias, 09:00 às 17:00" },
    { value: "seg-qua-08-12", label: "Segunda e Quarta, 08:00 às 12:00" },
    { value: "ter-qui-14-18", label: "Terça e Quinta, 14:00 às 18:00" },
    { value: "plantao-24h", label: "Plantão 24 horas" },
  ];

  // Opções de idiomas
  const idiomasOptions = [
    { value: "pt", label: "Português" },
    { value: "en", label: "Inglês" },
    { value: "es", label: "Espanhol" },
    { value: "fr", label: "Francês" },
    { value: "de", label: "Alemão" },
    { value: "it", label: "Italiano" },
    { value: "ja", label: "Japonês" },
    { value: "zh", label: "Chinês" },
  ];

  // Validar nickname no banco
  const validateNickname = async (nickname: string) => {
    if (!nickname || nickname.trim() === "") {
      setNicknameError("");
      return true;
    }

    if (nickname.includes(" ")) {
      setNicknameError("Nickname não pode conter espaços");
      return false;
    }

    setValidatingNickname(true);
    try {
      const { data, error } = await supabase
        .from("prestadores")
        .select("id")
        .eq("nickname", nickname)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = não encontrou nenhum registro
        throw error;
      }

      if (data) {
        setNicknameError("Este nickname já está em uso");
        setValidatingNickname(false);
        return false;
      }

      setNicknameError("");
      setValidatingNickname(false);
      return true;
    } catch (error: any) {
      console.error("Erro ao validar nickname:", error);
      setNicknameError("Erro ao validar nickname");
      setValidatingNickname(false);
      return false;
    }
  };

  // Debounce para validar nickname
  useEffect(() => {
    if (formData.nickname && formData.nickname.trim() !== "" && !formData.nickname.includes(" ")) {
      const timeoutId = setTimeout(() => {
        validateNickname(formData.nickname);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setNicknameError("");
    }
  }, [formData.nickname]);

  // Carregar nome do sessionStorage
  useEffect(() => {
    const dadosPessoaisStr = sessionStorage.getItem("prestadorDadosPessoais");
    if (dadosPessoaisStr) {
      try {
        const dadosPessoais = JSON.parse(dadosPessoaisStr);
        // Nome completo vem dos dados pessoais, não precisa mostrar no formulário
      } catch (e) {
        console.error("Erro ao carregar dados pessoais:", e);
      }
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    // Validação especial para nickname (sem espaços)
    if (field === "nickname") {
      const nicknameSemEspacos = value.replace(/\s/g, "");
      if (value !== nicknameSemEspacos) {
        setNicknameError("Nickname não pode conter espaços");
      } else {
        setNicknameError("");
      }
      value = nicknameSemEspacos;
    }

    // Validação de email
    if (field === "email_profissional") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setEmailError("Email inválido");
      } else {
        setEmailError("");
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handler para múltipla escolha (similar às áreas)
  const handleMultiSelect = (field: "disponibilidade" | "idiomas", value: string) => {
    setFormData((prev) => {
      const currentArray = prev[field];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  // Validar email no banco
  const validateEmail = async (email: string) => {
    if (!email || email.trim() === "") {
      setEmailError("");
      return true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Email inválido");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("prestadores")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setEmailError("Este email já está em uso");
        return false;
      }

      setEmailError("");
      return true;
    } catch (error: any) {
      console.error("Erro ao validar email:", error);
      setEmailError("Erro ao validar email");
      return false;
    }
  };

  // Validar telefone no banco
  const validateTelefone = async (telefone: string) => {
    if (!telefone || telefone.trim() === "") {
      setTelefoneError("");
      return true;
    }

    try {
      const { data, error } = await supabase
        .from("prestadores")
        .select("id")
        .eq("telefone", telefone)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setTelefoneError("Este telefone já está em uso");
        return false;
      }

      setTelefoneError("");
      return true;
    } catch (error: any) {
      console.error("Erro ao validar telefone:", error);
      setTelefoneError("Erro ao validar telefone");
      return false;
    }
  };

  const handleSubmit = async () => {
    // Validar nickname
    if (formData.nickname) {
      const isNicknameValid = await validateNickname(formData.nickname);
      if (!isNicknameValid) {
        return;
      }
    }

    // Validar email
    if (formData.email_profissional) {
      const isEmailValid = await validateEmail(formData.email_profissional);
      if (!isEmailValid) {
        return;
      }
    }

    // Validar telefone
    if (formData.telefone) {
      const isTelefoneValid = await validateTelefone(formData.telefone);
      if (!isTelefoneValid) {
        return;
      }
    }

    // Salvar dados do perfil no sessionStorage
    const dadosPerfil = {
      nickname: formData.nickname || null,
      foto_url: formData.foto_url || null,
      descricao: formData.descricao || null,
      galeria_1: formData.galeria_1 || null,
      galeria_2: formData.galeria_2 || null,
      rede_social: formData.rede_social || null,
      linkedin: formData.linkedin || null,
      disponibilidade: formData.disponibilidade.length > 0 
        ? formData.disponibilidade
        : null,
      idiomas: formData.idiomas.length > 0 
        ? formData.idiomas
        : null,
      telefone: formData.telefone || null,
      email_profissional: formData.email_profissional || null,
    };

    sessionStorage.setItem("prestadorDadosPerfil", JSON.stringify(dadosPerfil));

    // Navegar para a página de conclusão
    onNavigate?.("concluido");
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <TopBar activeLink="cadastro" onNavigate={onNavigate} />

      <ScrollArea className="flex-1">
        <div className="flex items-center justify-center min-h-full px-4 sm:px-6 py-2">
          <div className="w-full max-w-[450px]">
          <div className="text-center mb-3">
            <h1 className="text-2xl mb-1">Cadastro Prestador de Serviço</h1>
            <h2 className="text-[#FF6B35] text-xl">Dados do Perfil</h2>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            {/* Grid com 2 colunas para os 10 primeiros campos */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Coluna Esquerda - 5 campos */}
            <div className="space-y-4">
              {/* Nickname */}
              <div>
                <Label htmlFor="nickname" className="text-gray-700 mb-1 block text-sm">Nome de Usuário / Nickname</Label>
                  <Input 
                    id="nickname" 
                    type="text" 
                    placeholder="joaosilva" 
                    value={formData.nickname} 
                    onChange={(e) => handleInputChange("nickname", e.target.value)}
                    className={nicknameError ? "border-red-500" : ""}
                  />
                  {validatingNickname && (
                    <p className="text-xs text-gray-500 mt-1">Verificando...</p>
                  )}
                  {nicknameError && !validatingNickname && (
                    <p className="text-xs text-red-500 mt-1">{nicknameError}</p>
                  )}
              </div>

              {/* Foto de Perfil */}
              <div>
                <Label htmlFor="foto_url" className="text-gray-700 mb-1 block text-sm">Foto de Perfil</Label>
                <Input id="foto_url" type="text" placeholder="https://exemplo.com/perfil.jpg" value={formData.foto_url} onChange={(e) => handleInputChange("foto_url", e.target.value)} />
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="descricao" className="text-gray-700 mb-1 block text-sm">Descrição / Bio curta</Label>
                <Input id="descricao" type="text" placeholder="Designer gráfico especializado em identidade visual" value={formData.descricao} onChange={(e) => handleInputChange("descricao", e.target.value)} />
              </div>

                {/* Galeria de Projetos 1 */}
              <div>
                <Label htmlFor="galeria_1" className="text-gray-700 mb-1 block text-sm">Galeria de Projetos</Label>
                <Input id="galeria_1" type="text" placeholder="https://exemplo.com/projeto1.jpg" value={formData.galeria_1} onChange={(e) => handleInputChange("galeria_1", e.target.value)} />
                </div>
              </div>

              {/* Coluna Direita - 5 campos */}
              <div className="space-y-4">
                {/* Redes Sociais / Portfólio */}
                <div>
                  <Label htmlFor="rede_social" className="text-gray-700 mb-1 block text-sm">Redes Sociais / Portfólio</Label>
                  <Input id="rede_social" type="text" placeholder="@joaodesigner" value={formData.rede_social} onChange={(e) => handleInputChange("rede_social", e.target.value)} />
                </div>

                {/* LinkedIn */}
                <div>
                  <Label htmlFor="linkedin" className="text-gray-700 mb-1 block text-sm">LinkedIn</Label>
                  <Input id="linkedin" type="text" placeholder="linkedin.com/in/joaosilva" value={formData.linkedin} onChange={(e) => handleInputChange("linkedin", e.target.value)} />
                </div>

                {/* Disponibilidade - Estilo igual às áreas */}
                <div>
                  <Label htmlFor="disponibilidade" className="text-gray-700 mb-1 block text-sm">
                    Disponibilidade
                  </Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !formData.disponibilidade.includes(value)) {
                        handleMultiSelect("disponibilidade", value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full border-gray-200">
                      <SelectValue
                        placeholder={
                          formData.disponibilidade.length > 0
                            ? formData.disponibilidade
                                .map((val) => disponibilidadeOptions.find((opt) => opt.value === val)?.label)
                                .filter(Boolean)
                                .join(", ")
                            : "Selecione a disponibilidade"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {disponibilidadeOptions.map((opcao) => (
                        <SelectItem
                          key={opcao.value}
                          value={opcao.value}
                          disabled={formData.disponibilidade.includes(opcao.value)}
                        >
                          {opcao.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.disponibilidade.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.disponibilidade.map((val) => {
                        const opcao = disponibilidadeOptions.find((opt) => opt.value === val);
                        return opcao ? (
                          <span
                            key={val}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-[#FF6B35] text-white text-xs rounded-full"
                          >
                            {opcao.label}
                            <button
                              type="button"
                              onClick={() => handleMultiSelect("disponibilidade", val)}
                              className="hover:bg-[#e55a28] rounded-full p-0.5"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Idiomas - Estilo igual às áreas */}
                <div>
                  <Label htmlFor="idiomas" className="text-gray-700 mb-1 block text-sm">
                    Idiomas
                  </Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !formData.idiomas.includes(value)) {
                        handleMultiSelect("idiomas", value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full border-gray-200">
                      <SelectValue
                        placeholder={
                          formData.idiomas.length > 0
                            ? formData.idiomas
                                .map((val) => idiomasOptions.find((opt) => opt.value === val)?.label)
                                .filter(Boolean)
                                .join(", ")
                            : "Selecione os idiomas"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {idiomasOptions.map((idioma) => (
                        <SelectItem
                          key={idioma.value}
                          value={idioma.value}
                          disabled={formData.idiomas.includes(idioma.value)}
                        >
                          {idioma.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.idiomas.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.idiomas.map((val) => {
                        const idioma = idiomasOptions.find((opt) => opt.value === val);
                        return idioma ? (
                          <span
                            key={val}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-[#FF6B35] text-white text-xs rounded-full"
                          >
                            {idioma.label}
                            <button
                              type="button"
                              onClick={() => handleMultiSelect("idiomas", val)}
                              className="hover:bg-[#e55a28] rounded-full p-0.5"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Galeria de Projetos 2 */}
              <div>
                  <Label htmlFor="galeria_2" className="text-gray-700 mb-1 block text-sm">Galeria de Projetos 2</Label>
                <Input id="galeria_2" type="text" placeholder="https://exemplo.com/projeto2.jpg" value={formData.galeria_2} onChange={(e) => handleInputChange("galeria_2", e.target.value)} />
                </div>
              </div>
              </div>

            {/* Seção inferior centralizada - Contato e Botão */}
            <div className="space-y-4 mt-6">
              {/* Contato Profissional */}
              <div>
                <Label htmlFor="telefone" className="text-gray-700 mb-1 block text-sm">Contato profissional</Label>
                <Input 
                  id="telefone" 
                  type="text" 
                  placeholder="(41) 99999-1111" 
                  value={formData.telefone} 
                  onChange={(e) => handleInputChange("telefone", e.target.value)}
                  onBlur={() => formData.telefone && validateTelefone(formData.telefone)}
                  className={telefoneError ? "border-red-500" : ""}
                />
                {telefoneError && (
                  <p className="text-xs text-red-500 mt-1">{telefoneError}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email_profissional" className="text-gray-700 mb-1 block text-sm">Email Profissional</Label>
                <Input 
                  id="email_profissional" 
                  type="email" 
                  placeholder="joao@email.com" 
                  value={formData.email_profissional} 
                  onChange={(e) => handleInputChange("email_profissional", e.target.value)}
                  onBlur={() => formData.email_profissional && validateEmail(formData.email_profissional)}
                  className={emailError ? "border-red-500" : ""}
                />
                {emailError && (
                  <p className="text-xs text-red-500 mt-1">{emailError}</p>
                )}
            </div>

              {/* Botão Avançar */}
              <div className="mt-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!!nicknameError || !!emailError || !!telefoneError}
                  className="w-full bg-[#FF6B35] hover:bg-[#e55a28] text-white py-2.5 rounded-xl text-sm disabled:opacity-50"
                >
                  Avançar
                </Button>
              </div>
            </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}


