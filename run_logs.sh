#!/bin/bash

watch -n 0.5 "(date '+DATE:%H:%M:%S'; curl localhost:3050/info_logs; echo '';) >> log.log"