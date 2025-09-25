start:
	docker-compose up -d

stop:
	docker-compose down

migrate:
	php artisan migrate

deploy:
	cd ..
	chmod -R 755 indicadores-backend
	cd indicadores-backend
	composer install --no-dev --optimize-autoloader
	php82 artisan migrate --force
	php82 artisan config:cache
	php82 artisan route:cache