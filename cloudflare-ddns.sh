#!/bin/sh

[ ! -f /var/tmp/current_ip.txt ] && touch /var/tmp/currentip.txt

NEWIP=`dig +short myip.opendns.com @resolver1.opendns.com`
CURRENTIP=`cat /var/tmp/currentip.txt`

if [ "$NEWIP" = "$CURRENTIP" ]
then
  echo "IP address unchanged"
else
  curl https://www.cloudflare.com/api_json.html \
    -d 'a=rec_edit' \
    -d 'tkn=$CF_DDNS_TKN' \
    -d 'email=$CF_DDNS_EMAIL' \
    -d 'z=$CF_DDNS_DOMAIN' \
    -d 'id=$CF_DDNS_REC_ID' \
    -d 'type=A' \
    -d 'name=$CF_DDNS_NAME' \
    -d 'ttl=1' \
    -d "content=$NEWIP"
  echo $NEWIP > /var/tmp/currentip.txt
fi
