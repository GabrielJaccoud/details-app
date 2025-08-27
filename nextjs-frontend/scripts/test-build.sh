#!/bin/bash

echo "Testando build do Next.js..."
npm run build

if [ $? -eq 0 ]; then
  echo "Build concluído com sucesso!"
  exit 0
else
  echo "Erro no build. Verifique os logs acima."
  exit 1
fi

