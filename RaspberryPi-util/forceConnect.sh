#!/usr/bin/bash
lockfile="/tmp/.forceConnectXYZ666"
if [[ -f $lockfile ]]
then
    echo "Already in progress. Exiting..."
    exit
fi

/usr/bin/touch $lockfile
source "devices.txt"
echo $btwi
/usr/bin/bluetoothctl trust $btwi
/usr/bin/bluetoothctl trust $btg1
/usr/bin/bluetoothctl trust $btg2
/usr/bin/bluetoothctl trust $btg3

/usr/bin/bluetoothctl connect $btwi
/usr/bin/bluetoothctl connect $btg1
/usr/bin/bluetoothctl connect $btg2
/usr/bin/bluetoothctl connect $btg3
rm $lockfile
