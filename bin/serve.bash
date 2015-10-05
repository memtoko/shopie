#!/bin/bash

NAME="shopie"
VIRTUALENVDIR=/home/vagrant/venv
DJANGODIR=/home/lab/shopie
SOCKFILE=/home/vagrant/gunicorn.sock
USER="vagrant"
GROUP="vagrant"
NUM_WORKERS=3
DJANGO_SETTINGS_MODULE=shopie.settings.dev_office  # which settings file should Django use
DJANGO_WSGI_MODULE=shopie.wsgi                     # WSGI module name

echo "Starting $NAME as `whoami`"

cd $DJANGODIR
source $VIRTUALENVDIR/bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH
# Create the run directory if it doesn't exist
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR
# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec $VIRTUALENVDIR/bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers=$NUM_WORKERS \
  --user=$USER --group=$GROUP \
  --bind=unix:$SOCKFILE \
  --log-level=debug \
  --log-file=-
