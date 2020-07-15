Annun
=====

I decided that Icinga shows you too much information.

Annun is an mqtt/ws driven Annunciator panel designed to show you just barely enough information to track down a problem.

You'll need an mqtt server (such as mosquitto) with websocket support.

Annun loads its config from mqtt. Visit the index page, and it will connect to an mqtt server, but show nothing.

setup.sh sets up the example, and marks the layout as a retained message on the layout topic.

events.sh plays a sequence of events that will then be shown on the annunciator panel.
