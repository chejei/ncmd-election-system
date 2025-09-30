# --------------------------
# Base PHP image with FPM
# --------------------------
FROM php:8.1-fpm

WORKDIR /var/www/html

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
# Ensure storage & cache directories are writable
# --------------------------
RUN mkdir -p storage bootstrap/cache && chown -R www-data:www-data storage bootstrap/cache

# --------------------------
# Expose the port Railway uses
# --------------------------
EXPOSE 8080

# --------------------------
# Entrypoint: generate .env from Railway variables & start Laravel
# --------------------------
CMD ["sh", "-c", "\
echo \"APP_NAME=\"${APP_NAME}\"" > .env && \
echo \"APP_ENV=\"${APP_ENV}\"" >> .env && \
echo \"APP_KEY=\"${APP_KEY}\"" >> .env && \
echo \"APP_DEBUG=\"${APP_DEBUG}\"" >> .env && \
echo \"APP_URL=\"${APP_URL}\"" >> .env && \
echo \"DB_CONNECTION=\"${DB_CONNECTION}\"" >> .env && \
echo \"DB_HOST=\"${DB_HOST}\"" >> .env && \
echo \"DB_PORT=\"${DB_PORT}\"" >> .env && \
echo \"DB_DATABASE=\"${DB_DATABASE}\"" >> .env && \
echo \"DB_USERNAME=\"${DB_USERNAME}\"" >> .env && \
echo \"DB_PASSWORD=\"${DB_PASSWORD}\"" >> .env && \
echo \"LOG_CHANNEL=\"${LOG_CHANNEL:-stack}\"" >> .env && \
echo \"LOG_DEPRECATIONS_CHANNEL=\"${LOG_DEPRECATIONS_CHANNEL:-null}\"" >> .env && \
echo \"LOG_LEVEL=\"${LOG_LEVEL:-debug}\"" >> .env && \
echo \"BROADCAST_DRIVER=\"${BROADCAST_DRIVER:-log}\"" >> .env && \
echo \"CACHE_DRIVER=\"${CACHE_DRIVER:-file}\"" >> .env && \
echo \"FILESYSTEM_DISK=\"${FILESYSTEM_DISK:-local}\"" >> .env && \
echo \"QUEUE_CONNECTION=\"${QUEUE_CONNECTION:-sync}\"" >> .env && \
echo \"SESSION_DRIVER=\"${SESSION_DRIVER:-file}\"" >> .env && \
echo \"SESSION_LIFETIME=\"${SESSION_LIFETIME:-120}\"" >> .env && \
echo \"MEMCACHED_HOST=\"${MEMCACHED_HOST:-127.0.0.1}\"" >> .env && \
echo \"REDIS_HOST=\"${REDIS_HOST:-127.0.0.1}\"" >> .env && \
echo \"REDIS_PASSWORD=\"${REDIS_PASSWORD:-null}\"" >> .env && \
echo \"REDIS_PORT=\"${REDIS_PORT:-6379}\"" >> .env && \
echo \"MAIL_MAILER=\"${MAIL_MAILER:-smtp}\"" >> .env && \
echo \"MAIL_HOST=\"${MAIL_HOST}\"" >> .env && \
echo \"MAIL_PORT=\"${MAIL_PORT}\"" >> .env && \
echo \"MAIL_USERNAME=\"${MAIL_USERNAME}\"" >> .env && \
echo \"MAIL_PASSWORD=\"${MAIL_PASSWORD}\"" >> .env && \
echo \"MAIL_ENCRYPTION=\"${MAIL_ENCRYPTION:-tls}\"" >> .env && \
echo \"MAIL_FROM_ADDRESS=\"${MAIL_FROM_ADDRESS}\"" >> .env && \
echo \"MAIL_FROM_NAME=\"${MAIL_FROM_NAME}\"" >> .env && \
php artisan config:cache && \
php artisan route:cache && \
php artisan serve --host=0.0.0.0 --port=${PORT:-8080} \
"]
