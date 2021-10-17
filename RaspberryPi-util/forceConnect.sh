#!/usr/bin/bash
lockfile="/tmp/.forceConnectXYZ666"
if [[ -f $lockfile ]]
then
    echo "Already in progress. Exiting..."
    exit
fi

/usr/bin/touch $lockfile

btwi="E4:E1:12:5D:54:F9" # WIDI Jack
btg1="7C:9E:BD:4B:07:A6" # BT Goggle 1
btg2="94:B9:7E:D4:D1:52" # BT Goggle 2
btg3="7C:9E:BD:4B:30:46" # BT Goggle 3
/usr/bin/bluetoothctl trust $btwi
/usr/bin/bluetoothctl trust $btg1
/usr/bin/bluetoothctl trust $btg2
/usr/bin/bluetoothctl trust $btg3

/usr/bin/bluetoothctl connect $btwi
/usr/bin/bluetoothctl connect $btg1
/usr/bin/bluetoothctl connect $btg2
/usr/bin/bluetoothctl connect $btg3
rm $lockfile
