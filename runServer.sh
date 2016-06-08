#!/bin/bash

require='/usr/bin/supervisor'

if [ ! -f $require ]
then
    echo "Error $require is not present on this system, please install it by typing npm install -g supervisor" 
    exit
fi

log='/var/log/backend/ealert-api.log'
SRV=index.js
ENV='development'
DIR=$(dirname $0)

echo "Executing on $DIR server: $SRV env: $ENV"
cd $DIR
NODE_ENV=$ENV DEBUG=elstalert-rulz:* $require -i . $SRV >> $log 2>&1
