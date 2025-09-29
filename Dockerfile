# Use official PHP 8.1 image with Apache
FROM php:8.1-apache

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev unzip libpq-dev libonig-dev git \
    && docker-php-ext-install pdo pdo_mysql zip mbstring bcmath

# Enable Apache mod_rewrite for Laravel routing
RUN a2enmod rewrite

# Set a global ServerName to suppress the warning
RUN echo "ServerName localhost" > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername

# Set working directory
WORKDIR /var/www/html

# Copy Laravel files
COPY . .

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --ignore-platform-reqs

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
