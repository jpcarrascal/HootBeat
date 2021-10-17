#!/bin/bash
# Monitors BT Goggle devices and connects them when they show up

#while true
#do # Loop begins. Not necessary if service is automatically restarted

usb=`/usr/bin/aconnect -l | /usr/bin/tr -d "\n" | /usr/bin/awk -Fclient 'BEGIN {OFS="\n"}; {$1=$1; print$0}' | /usr/bin/grep "USB MIDI" | awk -F "\'" '{print $2}'`
widi=`/usr/bin/aconnect -l | /usr/bin/tr -d "\n" | /usr/bin/awk -Fclient 'BEGIN {OFS="\n"}; {$1=$1; print$0}' | /usr/bin/grep "WIDI Jack" | awk -F "\'" '{print $2}'`
tmp=`/usr/bin/aconnect -l | /usr/bin/tr -d "\n" | /usr/bin/awk -Fclient 'BEGIN {OFS="\n"}; {$1=$1; print$0}' | /usr/bin/grep "BT Goggle"`
# From: https://stackoverflow.com/questions/19771965/split-bash-string-by-newline-characters
IFS=$'\n' goggles=($tmp)

connectGoogle() {
    for goggle in "${goggles[@]}"; do
        IFS=$'\'' array1=($goggle)
        name=${array1[1]}
        connections=${array1[4]}
        if [[ $connections = *Connected* ]] && [[ $connections = *,* ]]
        then
            echo "$name is connected"
        else
            echo "$name IS NOT CONNECTED, connecting..."
            /usr/bin/aconnect $1 $name
        fi
    done
}

if [ "$usb" != "" ]
then
    echo "USB MIDI device found"
    connectGoogle $usb
fi

if [ "$widi" != "" ]
then
    echo "WIDI Jack device found"
    connectGoogle $widi
fi
echo "================"

#sleep 5
#done # Loop ends
