#!/bin/bash

mosquitto_pub -p 15915 -t /annun/default/annunciations -m '{ "annunciator": "master-caution", "event": "on" }'
mosquitto_pub -p 15915 -t /annun/default/annunciations -m '{ "annunciator": "t1trip", "event": "on" }'

sleep 2
mosquitto_pub -p 15915 -t /annun/default/annunciations -m '{ "annunciator": "t2trip", "event": "on" }'

sleep 4
mosquitto_pub -p 15915 -t /annun/default/annunciations -m '{ "annunciator": "t1trip", "event": "off" }'
mosquitto_pub -p 15915 -t /annun/default/annunciations -m '{ "annunciator": "t2trip", "event": "off" }'
mosquitto_pub -p 15915 -t /annun/default/annunciations -m '{ "annunciator": "master-caution", "event": "off" }'
