#!/bin/bash
# Will shutdown system if USB MIDI device is not connected


usbConnected=`/usr/bin/lsusb | grep "fc02:0101"`
if [ "$usbConnected" = "" ]
then
    if [[ -f "/tmp/usbdisconnectedrandom666" ]]
    then
        echo "Not connected!"
        wall "Shutting down system..."
        /usr/bin/sync
        /usr/sbin/halt
    else
        echo "Not connected, but lockfile does not exist. Creating..."
        /usr/bin/touch "/tmp/usbdisconnectedrandom666"
    fi
else
    echo "Connected"
    if [[ -f "/tmp/usbdisconnectedrandom666" ]]
    then
        echo "Lockfile exists. Removing..."
        rm -f "/tmp/usbdisconnectedrandom666"
    fi
fi

