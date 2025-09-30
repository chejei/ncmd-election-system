# --------------------------
# Stage 1: Build stage
# --------------------------
FROM composer:2 AS builder

WORKDIR /app

# Copy composer files first for caching
COPY composer.json composer.lock ./

# Allow Composer unlimited memory (prevents out-of-memory errors)
ENV COMPOSER_MEMORY_LIMIT=-1

# Install PHP dependencies (no dev) for production
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --ignore-platform-reqs

# Copy the rest of the Laravel application
COPY . .

# Cache config and routes for production
RUN php artisan config:cache && php artisan route:cache

# --------------------------
# Stage 2: Production stage
# --------------------------
FROM php:8.1-fpm

WORKDIR /var/www/html

# Install required PHP extensions for Laravel
RUN apt-get update && apt-get install -y \
    libzip-dev unzip libonig-dev git libpq-dev libxml2-dev libicu-dev libpng-dev libjpeg-dev \
    && docker-php-ext-install pdo pdo_mysql zip mbstring bcmath intl xml gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy app from builder stage
COPY --from=builder /app /var/www/html

# Ensure storage and cache folders exist and are writable
RUN mkdir -p storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
