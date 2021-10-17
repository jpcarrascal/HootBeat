#!/usr/bin/bash
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
