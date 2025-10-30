import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TopBar } from "./TopBar";

interface CadastroPageProps {
  onNavigate?: (page: string) => void;
}

export function CadastroPage({ onNavigate }: CadastroPageProps) {
  const [tipoCadastro, setTipoCadastro] = useState<"usuario" | "prestador">("usuario");

  return (
    <div className="min-h-screen bg-[#C8D5B9] flex items-center justify-center p-8">
      <div className="bg-white rounded-[40px] w-full max-w-7xl shadow-lg">
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
    </div>
  );
}

interface FormCadastroUsuarioProps {
  onNavigate?: (page: string) => void;
}

function FormCadastroUsuario({ onNavigate }: FormCadastroUsuarioProps) {
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
            type="password"
            placeholder="senhaSegura123"
            className="w-full pr-10 border-gray-200"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <EyeOff className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Botão Avançar */}
      <Button 
        onClick={() => onNavigate?.("concluido")}
        className="w-full bg-[#FF6B35] hover:bg-[#e55a28] text-white py-6 rounded-xl text-lg mt-6"
      >
        Avançar
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
        />
      </div>

      {/* Gênero */}
      <div>
        <Label htmlFor="genero" className="text-gray-700 mb-2 block">
          Genero
        </Label>
        <Select>
          <SelectTrigger className="w-full border-gray-200">
            <SelectValue placeholder="Masculino" />
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
          RG ou Certidão de Nascimento
        </Label>
        <Select>
          <SelectTrigger className="w-full border-gray-200">
            <SelectValue placeholder="https://exemplo.com/rg.jpg" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upload">Fazer upload do documento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Botão Avançar */}
      <Button 
        onClick={() => onNavigate?.("concluido")}
        className="w-full bg-[#FF6B35] hover:bg-[#e55a28] text-white py-6 rounded-xl text-lg mt-6"
      >
        Avançar
      </Button>
    </div>
  );
}
