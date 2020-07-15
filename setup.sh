#!/bin/bash

mosquitto_pub -p 15915 -t /annun/default/layout -r -s <<EOJSON
[
  {
    "name": "master-caution",
    "row": 1,
    "column": 1,
    "colour": "red",
    "annunciation": "Master Caution"
  },
  {
    "name": "t1trip",
    "row": 2,
    "column": 1,
    "colour": "white",
    "annunciation": "Turbine 1 trip"
  },
  {
    "name": "t2trip",
    "row": 2,
    "column": 2,
    "colour": "white",
    "annunciation": "Turbine 2 trip"
  }
]
EOJSON
