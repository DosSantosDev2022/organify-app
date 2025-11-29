// components/ContributePixModal.tsx

"use client";

import { Copy, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Ajuste o caminho conforme sua estrutura
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

// 📌 VARIÁVEIS DO PIX: POR FAVOR, PREENCHA COM SEUS DADOS REAIS
const PIX_QRCODE_IMAGE_URL = "/qrcode-pix.png"; // Exemplo: Coloque aqui o caminho para a sua imagem do QR Code
const PIX_COPY_PASTE_CODE = "00020126510014br.gov.bcb.pix0129dossantosdevoficial@gmail.com5204000053039865802BR5925Juliano Conceicao Dos San6009Sao Paulo62290525REC692AF173DA95653977495963045F84";
const PIX_KEY = "dossantosdevoficial@gmail.com";
// -------------------------------------------------------------

export function ContributePixModal() {

  const handleCopy = () => {
    // 1. Usa a API do navegador para copiar texto para a área de transferência
    navigator.clipboard.writeText(PIX_COPY_PASTE_CODE);

    // 2. Exibe uma notificação de sucesso
    toast("O código PIX Copia e Cola foi copiado para a área de transferência. Muito obrigado!");
  };

  return (
    <Dialog>
      {/* Botão que abre o Modal (Trigger) */}
      <DialogTrigger asChild>
        <Button>
          Contribuir com o projeto
          <QrCode className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            Apoie o Projeto
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Se você gosta da aplicação e deseja contribuir para o desenvolvimento e manutenção, qualquer valor é bem-vindo!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">

          {/* 🖼️ Seção do QR Code (Requer que a imagem esteja no caminho correto) */}
          <div className="flex justify-center p-2 border relative rounded-lg h-60 w-full">

            <Image
              src={PIX_QRCODE_IMAGE_URL}
              alt="QR Code PIX para Contribuição"
              className="object-contain"
              fill

              // 💡 Propriedades de otimização
              sizes="(max-width: 768px) 100vw, 300px"
              priority
            />
          </div>

          <p className="text-sm text-center font-semibold text-muted-foreground">
            Leia o código com a câmera do seu banco ou use a opção abaixo.
          </p>

          {/* Chave PIX */}
          <div className="text-center p-2 rounded-md bg-muted text-sm">
            <p className="text-xs text-muted-foreground">Chave PIX (E-mail):</p>
            <p className="font-medium truncate">{PIX_KEY}</p>
          </div>

          {/* Botão Copia e Cola */}
          <Button
            onClick={handleCopy}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiar Código PIX (Copia e Cola)
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}