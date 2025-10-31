import { Check } from "lucide-react";
import { TopBar } from "./TopBar";

interface ComoFuncionamosPageProps {
  onNavigate?: (page: string) => void;
}

export function ComoFuncionamosPage({ onNavigate }: ComoFuncionamosPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <TopBar activeLink="como-funcionamos" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="py-16 px-20 max-w-[1400px] mx-auto">
          {/* Título */}
          <div className="text-center mb-4">
            <h1 className="text-5xl mb-3">Como funcionamos?</h1>
            <p className="text-lg text-gray-700">
              Processo simples e seguro para conectar clientes e profissionais
            </p>
          </div>

          {/* Passos */}
          <div className="grid grid-cols-3 gap-8 mb-16 mt-12">
            {/* Passo 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#FF6B35] rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-4xl">1</span>
              </div>
              <h3 className="text-xl mb-3">Busque e Filtre</h3>
              <p className="text-gray-600 text-sm">
                Use nossos filtros para encontrar o profissional ideal na sua região
              </p>
            </div>

            {/* Passo 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#FF6B35] rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-4xl">2</span>
              </div>
              <h3 className="text-xl mb-3">Entre em contato</h3>
              <p className="text-gray-600 text-sm">
                Converse diretamente com o profissional e negocie o serviço
              </p>
            </div>

            {/* Passo 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#FF6B35] rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-4xl">3</span>
              </div>
              <h3 className="text-xl mb-3">Avalie o serviço</h3>
              <p className="text-gray-600 text-sm">
                Converse diretamente com o profissional e negocie o serviço
              </p>
            </div>
          </div>

          {/* Regras e diretrizes */}
          <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100">
            <h2 className="text-3xl text-center mb-10">Regras e diretrizes</h2>

            <div className="grid grid-cols-2 gap-12">
              {/* Para clientes */}
              <div>
                <h3 className="text-[#FF6B35] text-xl mb-6">Para clientes</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Seja claro sobre suas necessidades</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Negocie preços antes do início</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Avalie honestamente o serviço</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Mantenha comunicação respeitosa</span>
                  </div>
                </div>
              </div>

              {/* Para profissionais */}
              <div>
                <h3 className="text-[#FF6B35] text-xl mb-6">Para profissionais</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Mantenha perfil sempre atualizado</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Seja pontual e profissional</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Forneça orçamentos detalhados</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Responda rapidamente às mensagens</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
