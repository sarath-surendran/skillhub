#!/bin/sh

set -o errexit
set -o nounset

rm -f './celerybeat.pid'
celery -A backend beat -l INFO

beat