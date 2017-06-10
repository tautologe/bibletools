#!/bin/bash

docker build -t saxon .

docker run --rm --volume=$(pwd)/output:/output -it saxon bash -c "./fetchBible.sh"


