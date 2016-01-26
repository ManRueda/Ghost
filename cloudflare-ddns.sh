#!/bin/sh

[ ! -f /var/tmp/current_ip.txt ] && touch /var/tmp/currentip.txt

NEWIP=`dig +short myip.opendns.com @resolver1.opendns.com`
CURRENTIP=`cat /var/tmp/currentip.txt`

if [ "$NEWIP" = "$CURRENTIP" ]
then
  echo "IP address unchanged"
else
  curl "https://www.cloudflare.com/api_json.html?a=rec_edit&tkn=$CF_DDNS_TKN&email=$CF_DDNS_EMAIL&z=$CF_DDNS_DOMAIN&id=$CF_DDNS_REC_ID&type=A&name=$CF_DDNS_NAME&ttl=1&content=$NEWIP"
  echo $NEWIP > /var/tmp/currentip.txt
fi
