# Etapa de construcción
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json e instalar dependencias (con cache)
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copiar el código fuente
COPY . .

# Reemplazar styles.css temporalmente para el build
RUN cp src/styles-docker.css src/styles.css

# Construir la aplicación Angular
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:1.25-alpine

# Instalar herramientas útiles para debugging
RUN apk add --no-cache curl

# Copiar la configuración de Nginx personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos construidos de Angular
COPY --from=build /app/dist/reposteria-project/browser /usr/share/nginx/html

# Crear archivo de salud
RUN echo "healthy" > /usr/share/nginx/html/health.txt

# Salud del contenedor
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health.txt || exit 1

# Exponer puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]