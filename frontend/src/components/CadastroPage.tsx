import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { TopBar } from "./TopBar";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import {
  formatCPF,
  formatDate,
  formatDocument,
  formatDateToDB,
  isValidEmail,
  isValidCPF,
  unformatCPF,
  unformatDocument,
} from "../lib/formatters";

interface CadastroPageProps {
  onNavigate?: (page: string) => void;
}

export function CadastroPage({ onNavigate }: CadastroPageProps) {
  const [tipoCadastro, setTipoCadastro] = useState<"usuario" | "prestador">("usuario");

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <TopBar activeLink="cadastro" onNavigate={onNavigate} />

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="flex items-center justify-center min-h-full px-4 sm:px-6 py-2">
          <div className="w-full max-w-[450px]">
            <div className="text-center mb-3">
              <h1 className="text-2xl mb-1">
                {tipoCadastro === "usuario" ? "Cadastro Usuário" : "Cadastro Prestador de Serviço"}
              </h1>
              <h2 className="text-[#FF6B35] text-xl">Dados Pessoais</h2>
            </div>

            {/* Navbar Cadastro */}
            <div className="flex gap-2 mb-3">
              <Button
                onClick={() => setTipoCadastro("usuario")}
                className={`flex-1 py-1.5 text-xs rounded-xl transition ${
                  tipoCadastro === "usuario"
                    ? "bg-[#FF6B35] hover:bg-[#e55a28] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Cadastro Usuário
              </Button>
              <Button
                onClick={() => setTipoCadastro("prestador")}
                className={`flex-1 py-1.5 text-xs rounded-xl transition ${
                  tipoCadastro === "prestador"
                    ? "bg-[#FF6B35] hover:bg-[#e55a28] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Cadastro Prestador
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              {tipoCadastro === "usuario" ? (
                <FormCadastroUsuario onNavigate={onNavigate} />
              ) : (
                <FormCadastroPrestador onNavigate={onNavigate} />
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

interface FormCadastroUsuarioProps {
  onNavigate?: (page: string) => void;
}

function FormCadastroUsuario({ onNavigate }: FormCadastroUsuarioProps) {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    senha: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    // Aplica formatação automática conforme o tipo de campo
    if (field === "cpf") {
      formattedValue = formatCPF(value);
    } else if (field === "dataNascimento") {
      formattedValue = formatDate(value);
    }
    
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.nomeCompleto || !formData.cpf || !formData.dataNascimento || !formData.email || !formData.senha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Validação de CPF
    if (!isValidCPF(formData.cpf)) {
      toast.error("Por favor, insira um CPF válido com 11 dígitos");
      return;
    }

    // Validação de email
    if (!isValidEmail(formData.email)) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    // Validação de senha
    if (formData.senha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Primeiro, criar usuário no Auth do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
      });

      if (authError) {
        // Tratamento especial para rate limiting
        if (authError.message.includes('For security purposes')) {
          toast.error("Por favor, aguarde alguns segundos antes de tentar novamente. Isso é uma medida de segurança.");
          return;
        }
        throw authError;
      }

      // Se o usuário foi criado com sucesso, salvar dados adicionais na tabela usuarios
      if (authData.user) {
        console.log("✅ Auth criado com sucesso. User ID:", authData.user.id);
        
        const dadosParaSalvar = {
          nome_completo: formData.nomeCompleto,
          cpf: unformatCPF(formData.cpf),
          data_nascimento: formatDateToDB(formData.dataNascimento),
          email: formData.email,
        };
        
        console.log("📝 Tentando salvar na tabela usuarios:", dadosParaSalvar);
        
        const { data: insertedData, error: insertError } = await supabase
          .from("usuarios")
          .insert([dadosParaSalvar]);

        if (insertError) {
          console.error("❌ Erro ao salvar dados do usuário:");
          console.error("   Código:", insertError.code);
          console.error("   Mensagem:", insertError.message);
          console.error("   Detalhes:", insertError.details);
          console.error("   Hint:", insertError.hint);
          
          // Mensagem de erro mais específica
          let errorMessage = "Erro ao salvar dados. Tente novamente.";
          if (insertError.code === '23505') {
            errorMessage = "Email ou CPF já cadastrado no sistema.";
          } else if (insertError.code === '42P01') {
            errorMessage = "Tabela não encontrada. Verifique a configuração do banco.";
          } else if (insertError.message.includes('permission') || insertError.message.includes('row-level')) {
            errorMessage = "Sem permissão para salvar. Verifique as configurações de segurança.";
          }
          
          toast.error(errorMessage);
          setLoading(false);
          return;
        }

        console.log("✅ Dados salvos com sucesso! ID:", insertedData);
        toast.success("Cadastro realizado com sucesso!");
        onNavigate?.("concluido");
      } else {
        console.warn("⚠️ Auth criado mas user é null/undefined");
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error(error.message || "Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Nome Completo */}
      <div>
        <Label htmlFor="nomeCompleto" className="text-gray-700 mb-1 block text-sm">
          Nome Completo
        </Label>
        <Input
          id="nomeCompleto"
          type="text"
          placeholder="Maria Oliveira"
          className="w-full border-gray-200"
          value={formData.nomeCompleto}
          onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
        />
      </div>

      {/* CPF */}
      <div>
        <Label htmlFor="cpf" className="text-gray-700 mb-1 block text-sm">
          CPF
        </Label>
        <Input
          id="cpf"
          type="text"
          placeholder="123.987654-00"
          className="w-full border-gray-200"
          value={formData.cpf}
          onChange={(e) => handleInputChange("cpf", e.target.value)}
        />
      </div>

      {/* Data de nascimento */}
      <div>
        <Label htmlFor="dataNascimento" className="text-gray-700 mb-1 block text-sm">
          Data de nascimento
        </Label>
        <Input
          id="dataNascimento"
          type="text"
          placeholder="25/03/1992"
          className="w-full border-gray-200"
          value={formData.dataNascimento}
          onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
        />
      </div>

      {/* E-mail */}
      <div>
        <Label htmlFor="email" className="text-gray-700 mb-1 block text-sm">
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="maria.oliveira@email.com"
          className="w-full border-gray-200"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
      </div>

      {/* Senha */}
      <div>
        <Label htmlFor="senha" className="text-gray-700 mb-1 block text-sm">
          Senha
        </Label>
        <div className="relative">
          <Input
            id="senha"
            type={showPassword ? "text" : "password"}
            placeholder="senhaSegura123"
            className="w-full pr-10 border-gray-200"
            value={formData.senha}
            onChange={(e) => handleInputChange("senha", e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Botão Avançar */}
      <Button 
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#FF6B35] hover:bg-[#e55a28] text-white py-2.5 rounded-xl text-sm mt-3 disabled:opacity-50"
      >
        {loading ? "Salvando..." : "Avançar"}
      </Button>

      {/* Link para Login */}
      <div className="text-center mt-2">
        <span className="text-gray-700 text-sm">Já tem uma conta? </span>
        <a href="#" className="text-[#FF6B35] hover:underline text-sm">
          Entrar
        </a>
      </div>
    </div>
  );
}

interface FormCadastroPrestadorProps {
  onNavigate?: (page: string) => void;
}

function FormCadastroPrestador({ onNavigate }: FormCadastroPrestadorProps) {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    documento: "",
    genero: "",
    rg_url: "",
    email: "",
    senha: "",
  });

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    // Aplica formatação automática conforme o tipo de campo
    if (field === "documento") {
      formattedValue = formatDocument(value);
    } else if (field === "email" && value && !isValidEmail(value) && value.includes("@")) {
      // Permite email incompleto durante a digitação, mas valida no submit
      formattedValue = value;
    }
    
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const handleSubmit = () => {
    // Validação básica
    if (!formData.nome || !formData.sobrenome || !formData.documento || !formData.email || !formData.senha) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Validação de documento (CPF ou CNPJ)
    const documentoClean = unformatDocument(formData.documento);
    if (documentoClean.length !== 11 && documentoClean.length !== 14) {
      toast.error("Por favor, insira um CPF (11 dígitos) ou CNPJ (14 dígitos) válido");
      return;
    }

    // Validação de email (obrigatório)
    if (!isValidEmail(formData.email)) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    // Validação de senha (obrigatória)
    if (formData.senha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    // Armazenar dados pessoais no sessionStorage para salvar depois
    const dadosPessoais = {
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      documento: unformatDocument(formData.documento), // Remove formatação
      genero: formData.genero || null,
      rg_url: formData.rg_url || null,
      email: formData.email,
      senha: formData.senha,
    };

    sessionStorage.setItem("prestadorDadosPessoais", JSON.stringify(dadosPessoais));

    // Navegar para a tela de dados profissionais
    onNavigate?.("cadastro-profissional");
  };

  return (
    <div className="space-y-4">
      {/* Nome */}
      <div>
        <Label htmlFor="nome" className="text-gray-700 mb-1 block text-sm">
          Nome
        </Label>
        <Input
          id="nome"
          type="text"
          placeholder="João"
          className="w-full border-gray-200"
          value={formData.nome}
          onChange={(e) => handleInputChange("nome", e.target.value)}
        />
      </div>

      {/* Sobrenome */}
      <div>
        <Label htmlFor="sobrenome" className="text-gray-700 mb-1 block text-sm">
          Sobrenome
        </Label>
        <Input
          id="sobrenome"
          type="text"
          placeholder="Silva"
          className="w-full border-gray-200"
          value={formData.sobrenome}
          onChange={(e) => handleInputChange("sobrenome", e.target.value)}
        />
      </div>

      {/* CNPJ ou CPF */}
      <div>
        <Label htmlFor="documento" className="text-gray-700 mb-1 block text-sm">
          CNPJ ou CPF
        </Label>
        <Input
          id="documento"
          type="text"
          placeholder="987.654.321-00"
          className="w-full border-gray-200"
          value={formData.documento}
          onChange={(e) => handleInputChange("documento", e.target.value)}
        />
      </div>

      {/* Gênero */}
      <div>
        <Label htmlFor="genero" className="text-gray-700 mb-1 block text-sm">
          Genero
        </Label>
        <Select value={formData.genero} onValueChange={(value) => handleInputChange("genero", value)}>
          <SelectTrigger className="w-full border-gray-200">
            <SelectValue placeholder="Selecione o gênero" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="feminino">Feminino</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
            <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* RG ou Certidão de Nascimento */}
      <div>
        <Label htmlFor="rg" className="text-gray-700 mb-1 block text-sm">
          RG ou Certidão de Nascimento (URL)
        </Label>
        <Input
          id="rg"
          type="text"
          placeholder="https://exemplo.com/rg.jpg"
          className="w-full border-gray-200"
          value={formData.rg_url}
          onChange={(e) => handleInputChange("rg_url", e.target.value)}
        />
      </div>

      {/* E-mail (obrigatório) */}
      <div>
        <Label htmlFor="email-prestador" className="text-gray-700 mb-1 block text-sm">
          E-mail
        </Label>
        <Input
          id="email-prestador"
          type="email"
          placeholder="joao.silva@email.com"
          className="w-full border-gray-200"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
      </div>

      {/* Senha (obrigatória) */}
      <div>
        <Label htmlFor="senha-prestador" className="text-gray-700 mb-1 block text-sm">
          Senha
        </Label>
        <Input
          id="senha-prestador"
          type="password"
          placeholder="senhaSegura123"
          className="w-full border-gray-200"
          value={formData.senha}
          onChange={(e) => handleInputChange("senha", e.target.value)}
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
  );
}
