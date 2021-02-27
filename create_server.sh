#!/bin/bash

docker run -dti --name containersh$1 -p $1:3000 servers