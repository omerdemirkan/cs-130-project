#! /bin/bash

(cd web && npm run dev) & (./apache-fuseki/fuseki-server)
