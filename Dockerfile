# --------------------------
# Stage 1: Build stage
# --------------------------
FROM composer:2 AS builder

WORKDIR /app

# Copy composer files and install dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --ignore-platform-reqs

# Copy the rest of the application
COPY . .

# Optional: cache config and routes
RUN php artisan config:cache && php artisan route:cache

# --------------------------
# Stage 2: Production stage
# --------------------------
FROM php:8.1-fpm

# Install required PHP extensions
RUN apt-get update && apt-get install -y \
    libzip-dev unzip libonig-dev git libpq-dev \
    && docker-php-ext-install pdo pdo_mysql zip mbstring bcmath

WORKDIR /var/www/html

# Copy app from builder stage
COPY --from=builder /app /var/www/html

# Ensure storage and cache folders exist and have proper permissions
RUN mkdir -p storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
