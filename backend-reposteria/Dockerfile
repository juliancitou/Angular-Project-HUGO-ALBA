FROM php:8.3-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd intl zip

# Instalar Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Limpiar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

# Crear directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos de configuración primero (para mejor cache de Docker)
COPY composer.json composer.lock ./

# Instalar dependencias de Composer (con cache)
RUN composer install --no-dev --no-scripts --no-autoloader

# Copiar el resto del código
COPY . .

# Ejecutar autoloader y optimizar
RUN composer dump-autoload --optimize

# Permisos para Laravel
RUN chown -R www-data:www-data /var/www/html/storage
RUN chown -R www-data:www-data /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage
RUN chmod -R 775 /var/www/html/bootstrap/cache

# Crear usuario para desarrollo (opcional)
RUN groupadd -g 1000 developer && \
    useradd -u 1000 -g developer -m developer && \
    usermod -aG www-data developer

# Exponer puerto
EXPOSE 8000

# Salud del contenedor
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Comando para ejecutar el servidor
CMD php artisan serve --host=0.0.0.0 --port=8000