# --------------------------
# Base PHP CLI image
# --------------------------
FROM php:8.1-cli

WORKDIR /app

# --------------------------
# Install system dependencies & PHP extensions
# --------------------------
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev libonig-dev libpq-dev libxml2-dev libicu-dev \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql zip mbstring bcmath intl xml gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# --------------------------
# Install Composer
# --------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_MEMORY_LIMIT=-1

# --------------------------
# Copy application code
# --------------------------
COPY . .

# --------------------------
# Install PHP dependencies
# --------------------------
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --ignore-platform-reqs

# --------------------------
# Laravel cache for production
# --------------------------
RUN php artisan config:cache && php artisan route:cache

# --------------------------
# Ensure storage & cache directories are writable
# --------------------------
RUN mkdir -p storage bootstrap/cache && chown -R www-data:www-data storage bootstrap/cache

# --------------------------
# Expose Railway port
# --------------------------
ENV PORT 8080
EXPOSE 8080

# --------------------------
# Start Laravel server (listen on $PORT)
# --------------------------
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=${PORT}"]
