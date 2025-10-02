# Usando Node.js LTS
FROM node:20-alpine

# Instalar dependências de build
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    giflib-dev \
    jpeg-dev \
    libpng-dev \
    musl-dev \
    bash

# Diretório de trabalho no container
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install --legacy-peer-deps

# Copia todo o código do projeto
COPY . .

# Expõe a porta que o Vite usa
EXPOSE 5173

# Comando padrão para desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
