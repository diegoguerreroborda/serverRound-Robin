#!/bin/bash
watch -n 0.5 "(date '+DATE:%H:%M:%S'; echo '3000' ; curl localhost:3000/ ; echo ''; curl 192.168.1.8:3000/ ; echo ''; curl 192.168.1.8:3000/;echo '';) >> log.txt"