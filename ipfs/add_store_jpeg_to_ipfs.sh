#!/bin/sh

for f in ../public/shop*jpg
do

  echo "Adding $f to IPFS  ...."
  ipfs add $f

done
