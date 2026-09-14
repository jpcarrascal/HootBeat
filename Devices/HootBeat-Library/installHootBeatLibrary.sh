#!/bin/bash
destination=~/Documents/Arduino/libraries/HootBeat

read -r -p "Install HootBeat library to $destination? [Y/n] " confirm
if [[ ! $confirm =~ ^([Yy]|[Yy][Ee][Ss])?$ ]]; then
	read -r -p "Enter destination directory: " destination
fi

/bin/cp ./HootBeat.h $destination
/bin/cp ./HootBeat.cpp $destination
