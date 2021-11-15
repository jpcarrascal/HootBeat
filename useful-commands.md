# A few useful commands:
## MIDI

Dump/Monitor MIDI data, list devices, connect devices:

```
aseqdump --port {device}
aconnect -l 
aconnect {outport} {import}
```

# Bluetooth:

List/Scan/connect/disconnect devices. Uses MAC addresses:
```
bluetoothctl
```
Trust and connect a device:
```
bluetoothctl trust {MAC addr}
bluetoothctl connect {MAC addr}
```

Show list of Bluetooth devices _currently_ connected:
```
hcitool dev
```

# Services
Service scripts are located in /etc/systemd/system)

```
sudo systemctl daemon-reload
systemctl start|stop {service-name}
systemctl enable {service-name}
systemctl status {service-name}
```
