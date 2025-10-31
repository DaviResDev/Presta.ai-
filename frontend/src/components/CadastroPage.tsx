import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TopBar } from "./TopBar";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

interface CadastroPageProps {
  onNavigate?: (page: string) => void;
}

export function CadastroPage({ onNavigate }: CadastroPageProps) {
  const [tipoCadastro, setTipoCadastro] = useState<"usuario" | "prestador">("usuario");

  return (
    <div className="min-h-screen bg-white">
      <TopBar activeLink="cadastro" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex items-center justify-center py-16 px-12">
        <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h1 className="text-4xl mb-2">
                {tipoCadastro === "usuario" ? "Cadastro Usuário" : "Cadastro Prestador de Serviço"}
              </h1>
              <h2 className="text-[#FF6B35] text-3xl">Dados Pessoais</h2>
            </div>

            {/* Navbar Cadastro */}
            <div className="flex gap-3 mb-8">
              <Button
                onClick={() => setTipoCadastro("usuario")}
                className={`flex-1 py-3 rounded-xl transition ${
                  tipoCadastro === "usuario"
                    ? "bg-[#FF6B35] hover:bg-[#e55a28] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Cadastro Usuário
              </Button>
              <Button
                onClick={() => setTipoCadastro("prestador")}
                className={`flex-1 py-3 rounded-xl transition ${
                  tipoCadastro === "prestador"
                    ? "bg-[#FF6B35] hover:bg-[#e55a28] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Cadastro Prestador
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              {tipoCadastro === "usuario" ? (
                <FormCadastroUsuario onNavigate={onNavigate} />
              ) : (
                <FormCadastroPrestador onNavigate={onNavigate} />
              )}
            </div>
          </div>
        </div>
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatarDataParaDB = (data: string): string => {
    // Converte de DD/MM/YYYY para YYYY-MM-DD
    const partes = data.split("/");
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return data;
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.nomeCompleto || !formData.cpf || !formData.dataNascimento || !formData.email || !formData.senha) {
      toast.error("Por favor, preencha todos os campos");
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
        throw authError;
      }

      // Se o usuário foi criado com sucesso, salvar dados adicionais na tabela usuarios
      if (authData.user) {
        const { error: insertError } = await supabase
          .from("usuarios")
          .insert([
            {
              id: authData.user.id,
              nome_completo: formData.nomeCompleto,
              cpf: formData.cpf.replace(/\D/g, ""), // Remove formatação do CPF
              data_nascimento: formatarDataParaDB(formData.dataNascimento),
              email: formData.email,
            },
          ]);

        if (insertError) {
          console.error("Erro ao salvar dados do usuário:", insertError);
          toast.error("Erro ao salvar dados. Tente novamente.");
          setLoading(false);
          return;
        }

        toast.success("Cadastro realizado com sucesso!");
        onNavigate?.("concluido");
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error(error.message || "Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Nome Completo */}
      <div>
        <Label htmlFor="nomeCompleto" className="text-gray-700 mb-2 block">
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
        <Label htmlFor="cpf" className="text-gray-700 mb-2 block">
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
        <Label htmlFor="dataNascimento" className="text-gray-700 mb-2 block">
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
        <Label htmlFor="email" className="text-gray-700 mb-2 block">
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
        <Label htmlFor="senha" className="text-gray-700 mb-2 block">
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
        className="w-full bg-[#FF6B35] hover:bg-[#e55a28] text-white py-6 rounded-xl text-lg mt-6 disabled:opacity-50"
      >
        {loading ? "Salvando..." : "Avançar"}
      </Button>

      {/* Link para Login */}
      <div className="text-center mt-6">
        <span className="text-gray-700">Já tem uma conta? </span>
        <a href="#" className="text-[#FF6B35] hover:underline">
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
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.nome || !formData.sobrenome || !formData.documento) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      // Se houver email e senha, criar usuário no Auth do Supabase
      let authUserId: string | undefined;

      if (formData.email && formData.senha) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.senha,
        });

        if (authError) {
          throw authError;
        }

        authUserId = authData.user?.id;
      }

      // Salvar dados do prestador na tabela prestadores
      const { data: prestadorData, error: insertError } = await supabase
        .from("prestadores")
        .insert([
          {
            ...(authUserId && { id: authUserId }),
            nome: formData.nome,
            sobrenome: formData.sobrenome,
            documento: formData.documento.replace(/\D/g, ""), // Remove formatação
            genero: formData.genero || null,
            rg_url: formData.rg_url || null,
            ...(formData.email && { email: formData.email }),
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Erro ao salvar dados do prestador:", insertError);
        toast.error("Erro ao salvar dados. Tente novamente.");
        setLoading(false);
        return;
      }

      toast.success("Cadastro realizado com sucesso!");
      
      // Armazenar ID do prestador para uso posterior (escolha de serviços)
      if (prestadorData?.id) {
        sessionStorage.setItem("prestadorId", prestadorData.id);
      }

      onNavigate?.("concluido");
    } catch (error: any) {
      console.error("Erro ao cadastrar prestador:", error);
      toast.error(error.message || "Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Nome */}
      <div>
        <Label htmlFor="nome" className="text-gray-700 mb-2 block">
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
        <Label htmlFor="sobrenome" className="text-gray-700 mb-2 block">
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
        <Label htmlFor="documento" className="text-gray-700 mb-2 block">
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
        <Label htmlFor="genero" className="text-gray-700 mb-2 block">
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
        <Label htmlFor="rg" className="text-gray-700 mb-2 block">
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

      {/* E-mail (opcional para prestador) */}
      <div>
        <Label htmlFor="email-prestador" className="text-gray-700 mb-2 block">
          E-mail (opcional)
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

      {/* Senha (opcional, só se houver email) */}
      {formData.email && (
        <div>
          <Label htmlFor="senha-prestador" className="text-gray-700 mb-2 block">
            Senha (opcional)
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
      )}

      {/* Botão Avançar */}
      <Button 
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#FF6B35] hover:bg-[#e55a28] text-white py-6 rounded-xl text-lg mt-6 disabled:opacity-50"
      >
        {loading ? "Salvando..." : "Avançar"}
      </Button>
    </div>
  );
}
