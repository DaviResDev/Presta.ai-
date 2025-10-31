import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export function CadastroUsuario() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl mb-2">Cadastro Usuário</h1>
        <h2 className="text-[#FF6B35] text-3xl">Dados Pessoais</h2>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="space-y-6">
          {/* Nome Completo */}
          <div>
            <Label htmlFor="nomeCompleto" className="text-gray-700 mb-2 block">
              Nome Completo
            </Label>
            <Input
              id="nomeCompleto"
              type="text"
              placeholder="Maria Oliveira"
              className="w-full"
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
              className="w-full"
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
              className="w-full"
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
              className="w-full"
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
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Botão Avançar */}
          <Button className="w-full bg-[#FF6B35] hover:bg-[#e55a28] text-white py-6 rounded-lg text-lg mt-8">
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
      </div>
    </div>
  );
}
