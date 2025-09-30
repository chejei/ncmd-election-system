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
CMD sh -c '\
cat <<EOF > .env
APP_NAME=\"$APP_NAME\"
APP_ENV=\"$APP_ENV\"
APP_KEY=\"$APP_KEY\"
APP_DEBUG=\"$APP_DEBUG\"
APP_URL=\"$APP_URL\"
DB_CONNECTION=\"$DB_CONNECTION\"
DB_HOST=\"$DB_HOST\"
DB_PORT=\"$DB_PORT\"
DB_DATABASE=\"$DB_DATABASE\"
DB_USERNAME=\"$DB_USERNAME\"
DB_PASSWORD=\"$DB_PASSWORD\"
LOG_CHANNEL=\"${LOG_CHANNEL:-stack}\"
LOG_DEPRECATIONS_CHANNEL=\"${LOG_DEPRECATIONS_CHANNEL:-null}\"
LOG_LEVEL=\"${LOG_LEVEL:-debug}\"
BROADCAST_DRIVER=\"${BROADCAST_DRIVER:-log}\"
CACHE_DRIVER=\"${CACHE_DRIVER:-file}\"
FILESYSTEM_DISK=\"${FILESYSTEM_DISK:-local}\"
QUEUE_CONNECTION=\"${QUEUE_CONNECTION:-sync}\"
SESSION_DRIVER=\"${SESSION_DRIVER:-file}\"
SESSION_LIFETIME=\"${SESSION_LIFETIME:-120}\"
MEMCACHED_HOST=\"${MEMCACHED_HOST:-127.0.0.1}\"
REDIS_HOST=\"${REDIS_HOST:-127.0.0.1}\"
REDIS_PASSWORD=\"${REDIS_PASSWORD:-null}\"
REDIS_PORT=\"${REDIS_PORT:-6379}\"
MAIL_MAILER=\"${MAIL_MAILER:-smtp}\"
MAIL_HOST=\"$MAIL_HOST\"
MAIL_PORT=\"$MAIL_PORT\"
MAIL_USERNAME=\"$MAIL_USERNAME\"
MAIL_PASSWORD=\"$MAIL_PASSWORD\"
MAIL_ENCRYPTION=\"${MAIL_ENCRYPTION:-tls}\"
MAIL_FROM_ADDRESS=\"$MAIL_FROM_ADDRESS\"
MAIL_FROM_NAME=\"$MAIL_FROM_NAME\"
AWS_ACCESS_KEY_ID=\"$AWS_ACCESS_KEY_ID\"
AWS_SECRET_ACCESS_KEY=\"$AWS_SECRET_ACCESS_KEY\"
AWS_DEFAULT_REGION=\"${AWS_DEFAULT_REGION:-us-east-1}\"
AWS_BUCKET=\"$AWS_BUCKET\"
AWS_USE_PATH_STYLE_ENDPOINT=\"${AWS_USE_PATH_STYLE_ENDPOINT:-false}\"
PUSHER_APP_ID=\"$PUSHER_APP_ID\"
PUSHER_APP_KEY=\"$PUSHER_APP_KEY\"
PUSHER_APP_SECRET=\"$PUSHER_APP_SECRET\"
PUSHER_HOST=\"$PUSHER_HOST\"
PUSHER_PORT=\"${PUSHER_PORT:-443}\"
PUSHER_SCHEME=\"${PUSHER_SCHEME:-https}\"
PUSHER_APP_CLUSTER=\"${PUSHER_APP_CLUSTER:-mt1}\"
EOF
php artisan config:cache && php artisan route:cache && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}'
