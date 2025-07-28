#!/bin/bash

echo "🚀 Configurando MinIO para Evolution API..."

echo "⏳ Aguardando MinIO estar pronto..."
sleep 10

if ! command -v mc &> /dev/null; then
    echo "📦 Instalando MinIO Client..."
    wget https://dl.min.io/client/mc/release/linux-amd64/mc
    chmod +x mc
    sudo mv mc /usr/local/bin/
fi

echo "🔧 Configurando MinIO Client..."
mc alias set evolution http://localhost:9000 evolution evolution123

echo "📦 Criando bucket 'evolution-media'..."
mc mb evolution/evolution-media --ignore-existing

echo "🔓 Configurando políticas de acesso..."
mc policy set download evolution/evolution-media

echo "✅ MinIO configurado com sucesso!"
echo ""
echo "📋 Informações de acesso:"
echo "   Console MinIO: http://localhost:9001"
echo "   Usuário: evolution"
echo "   Senha: evolution123"
echo "   Bucket: evolution-media"
echo ""
echo "🔗 Endpoints S3:"
echo "   http://localhost:9000"
echo ""
echo "📝 Para acessar arquivos via Evolution API:"
echo "   GET http://localhost:8080/chat/findBase64/{instance}"
echo ""
echo "🎯 Agora você pode enviar arquivos via WhatsApp e eles serão salvos descriptografados no MinIO!" 