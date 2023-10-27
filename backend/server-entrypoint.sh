#!/bin/sh


# Debugging output
# echo "DB_USER: $POSTGRES_USER"
# echo "DB_PASSWORD: $POSTGRES_PASSWORD"
# echo "DB_NAME: $POSTGRES_DB"

# # Wait for the PostgreSQL database to be ready
# until PGPASSWORD="skillhub@123" psql -h "postgres" -U "skillhub" -d "skillhub" -c '\q'; do
#   echo 'Waiting for the PostgreSQL database to start...'
#   sleep 5
# done

# Sleep for a few seconds to ensure the database is ready
# echo "Waiting for the database to start..."
# sleep 10

python manage.py makemigrations

python manage.py migrate --noinput


# Create a superuser with custom values and password
# python manage.py createsuperuser --noinput --username admin --email admin@gmail.com
# python manage.py changepassword admin admin@123
# python manage.py createsuperuser --noinput


python manage.py collectstatic --noinput

# python manage.py createsuperuser --noinput
daphne -b 0.0.0.0 -p 8000 backend.asgi:application
# daphne -u /tmp/daphne.sock backend.asgi:application

# for debug
# python manage.py runserver 0.0.0.0:8000
# server_entry
# exec "$@"