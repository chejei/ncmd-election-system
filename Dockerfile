FROM php:8.1-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libjpeg-dev libfreetype6-dev libonig-dev libxml2-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd mbstring pdo pdo_mysql xml zip

# ✅ Install Composer
COPY --from=composer:2.5 /usr/bin/composer /usr/bin/composer

# ✅ Install Node.js & npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Set working directory
WORKDIR /var/www

# Copy project files
COPY . .

# ✅ Install dependencies
RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

# Expose port
EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000
