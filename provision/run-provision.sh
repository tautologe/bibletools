#!/bin/bash

docker build -t biblebuild .

docker run --rm --volume=$(pwd)/output:/output -it biblebuild bash -c "./fetchBible.sh"
