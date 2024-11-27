# Use the official PHP image as a base
FROM php:7.4-apache

# Copy application files to the container
COPY . /var/www/html/

# Set the working directory
WORKDIR /var/www/html/

# Expose port 80
EXPOSE 80